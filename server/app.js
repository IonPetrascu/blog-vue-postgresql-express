const express = require('express');
const bodyParser = require('body-parser')
const ws = require('ws');
const cors = require('cors')
const bcrypt = require('bcryptjs')
const client = require('./connection')
const jwt = require('jsonwebtoken')
const fileUpload = require('express-fileupload')
const { v4: uuidv4 } = require('uuid');
const path = require('path')
const http = require('http');

client.connect();
const app = express();

app.use(cors());
app.use(bodyParser.json({ limit: '50mb' }));
app.use(fileUpload({}))
app.use(express.urlencoded({ extended: true }));
app.use(express.static(path.resolve(__dirname, './static')));

const server = http.createServer(app);
const wss = new ws.Server({ server });

const port = process.env.PORT || 3000


server.listen(port, () => {
  console.log(`Сервер запущен на порту ${port}`);
});

wss.on('connection', function connection(ws) {
  ws.on('message', async function (message) {
    message = JSON.parse(message)
    switch (message.event) {
      case 'message':
        if (message.chat_id && message.user_id && message.message) {
          try {

            const hasAccess = await checkUserChatAccess(message.chat_id, message.user_id);
            if (!hasAccess) {
              ws.send(JSON.stringify({
                event: 'error',
                message: 'You do not have access to this chat'
              }));
              return;
            }

            message.sent_at = new Date().toISOString();
            const savedMessage = await saveMessageToDatabase(message);

            broadcastMessage(savedMessage);
          } catch (err) {
            console.error('Error processing message:', err);
          }
        } else {
          console.error('Invalid message format:', message);
        }
        break;
      case 'connection':

        ws.acces = await checkUserChatAccess(Number(message.id), message.user_id);
        ws.chat_id = Number(message.id);
        broadcastMessage(message)
        break;
      case 'history':
        try {

          const hasAccess = await checkUserChatAccess(Number(message.chat_id), message.user_id);
          if (!hasAccess) {
            ws.send(JSON.stringify({
              event: 'error',
              message: 'You do not have access to this chat'
            }));
            return;
          }

          const history = await getChatHistory(message.chat_id);
          ws.send(JSON.stringify({
            event: 'history',
            chat_id: message.chat_id,
            messages: history,
            sent_at: message.sent_at
          }));
        } catch (err) {
          console.error('Error fetching chat history:', err);
        }
        break;
    }
  })
})

function broadcastMessage(message) {
  wss.clients.forEach(client => {
    if (client.acces && message.chat_id && client.chat_id === message.chat_id) {
      client.send(JSON.stringify(message));
    }
  });
}

async function checkUserChatAccess(chat_id, user_id) {
  try {
    const query = `
      SELECT * FROM chat_users
      WHERE chat_id = $1 AND user_id = $2
    `;
    const result = await client.query(query, [chat_id, user_id]);
    return result.rows.length > 0;
  } catch (err) {
    console.error('Error checking user chat access:', err);
    throw err;
  }
}

async function saveMessageToDatabase(value) {
  try {
    const query = `
      INSERT INTO messages (chat_id, user_id, content, sent_at)
      VALUES ($1, $2, $3,$4) RETURNING *
    `;
    const data = await client.query(query, [value.chat_id, value.user_id, value.message, value.sent_at])
    data.rows[0].event = 'message'
    return data.rows[0]
  } catch (err) {
    console.error('Error saving message to database:', err);
  }
}

async function getChatHistory(chatId) {
  try {
    const query = `
      SELECT user_id, content, sent_at
      FROM messages
      WHERE chat_id = $1
      ORDER BY sent_at ASC
    `;
    const result = await client.query(query, [chatId]);
    return result.rows;
  } catch (err) {
    console.error('Error fetching chat history:', err);
    throw err;
  }
}

app.post('/register', async (req, res) => {
  try {
    const { email, password, name } = req.body;

    const hashedPassword = await bcrypt.hash(password, 10);

    const result = await client.query(
      'INSERT INTO "usersReg" (u_name, u_password, u_email) VALUES ($1, $2, $3) RETURNING *',
      [name, hashedPassword, email]
    );

    if (result.rows.length > 0) {
      res.status(201).json('Register succes!');
    } else {
      res.status(400).send('No data returned from the database');
    }
  } catch (error) {
    console.error('Error registering user:', error);
    res.status(500).send('Server Error');
  }
});

app.post('/login', async (req, res) => {

  try {
    const { email, password } = req.body;

    const result = await client.query('SELECT * FROM "usersReg" WHERE u_email = $1', [email])

    const user = result.rows[0]

    if (!user) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    const isPasswordMatch = await bcrypt.compare(password, user['u_password'])

    if (!isPasswordMatch) {
      return res.status(400).json({ message: "Invalid Credentials" })
    }

    const token = jwt.sign({ userId: user.id }, process.env.SECRET_KEY, {
      expiresIn: '1d'
    })

    res.json({ token })
  } catch (error) {
    console.log(error);
    res.status(500).send('Server Error')
  }
})

async function verifyToken(req, res, next) {
  const token = req.headers.authorization && req.headers.authorization.split(' ')[1]

  if (!token) {
    return res.status(401).json({ message: "Missing token" })
  }

  try {
    const decoded = jwt.verify(token, process.env.SECRET_KEY);

    if (decoded) {
      const result = await client.query('SELECT * FROM "usersReg" WHERE id = $1', [decoded.userId]);

      if (result.rows.length > 0) {
        req.user = result.rows[0];
        next();
      } else {
        res.status(404).json({ message: "User not found" });
      }
    } else {
      res.status(401).json({ message: "Invalid token" });
    }
  } catch (error) {
    console.error('Token verification failed', error.message);
    res.status(401).send('Invalid token');
  }
}

app.get('/userinfo', verifyToken, (req, res) => {
  res.json({ user: req.user });
});

app.post('/posts', verifyToken, async (req, res) => {
  try {
    const { title, description } = req.body;

    if (!title || !description) {
      return res.status(400).json({ message: 'Title and description are required' });
    }
    const img = req.files ? req.files.img : null;
    const user_id = req.user.id

    let fileName = null
    if (img) {
      fileName = uuidv4() + '.jpg';
      img.mv(path.resolve(__dirname, '..', 'server/static', fileName), (err) => {
        if (err) {
          console.error('Error moving file:', err);
          return res.status(500).send('Error uploading image');
        }
      });
    }


    // Запрос к базе данных
    const insertQuery = fileName
      ? `INSERT INTO posts(title, content, user_id, img) VALUES($1, $2, $3, $4) RETURNING *`
      : `INSERT INTO posts(title, content, user_id) VALUES($1, $2, $3) RETURNING *`;

    const values = fileName
      ? [title, description, user_id, fileName]
      : [title, description, user_id];

    const result = await client.query(insertQuery, values);
    res.status(200).json(result.rows[0]);

  } catch (error) {
    console.error('Error on add post:', error);
    res.status(500).send('Error on add post');
  }

})

app.get('/posts', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Token not found');
  }
  const user_id = req.user.id;



  try {
    const query = `
    WITH like_dislike_counts AS (
  SELECT
    v.entity_id AS post_id,
    COUNT(CASE WHEN v.vote_type = TRUE THEN 1 END)::INTEGER AS likes_count,
    COUNT(CASE WHEN v.vote_type = FALSE THEN 1 END)::INTEGER AS dislikes_count
  FROM votes v
  WHERE v.entity_type = 'post'
  GROUP BY v.entity_id
),
user_votes AS (
  SELECT
    v.entity_id AS post_id,
    MAX(CASE WHEN v.user_id = $1 THEN CASE WHEN v.vote_type THEN 1 ELSE 0 END ELSE NULL END) AS user_vote
  FROM votes v
  WHERE v.entity_type = 'post'
  GROUP BY v.entity_id
)
SELECT
  p.*,
  COALESCE(lc.likes_count, 0) AS likes_count,
  COALESCE(lc.dislikes_count, 0) AS dislikes_count,
  uv.user_vote,
  COUNT(c.id)::INTEGER AS comments_count,
  ur.id AS user_id,
  ur.u_name AS user_name,
  ur.u_email AS user_email
FROM posts p
LEFT JOIN like_dislike_counts lc ON p.id = lc.post_id
LEFT JOIN user_votes uv ON p.id = uv.post_id
LEFT JOIN comments c ON p.id = c.post_id
LEFT JOIN "usersReg" ur ON p.user_id = ur.id
GROUP BY p.id, lc.likes_count, lc.dislikes_count, uv.user_vote,ur.id, ur.u_name, ur.u_email
ORDER BY p.created_at DESC;
    `;

    const result = await client.query(query, [user_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on get posts:', err);
    res.status(500).send('Error on get posts');
  }
})

app.get('/posts/:id', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Token not found');
  }
  const postId = req.params.id;

  const insertQuery = `SELECT
                         posts.*,
                         "usersReg".u_name,
                         "usersReg".u_email
                       FROM
                         posts
                       JOIN
                         "usersReg" ON "usersReg".id = posts.user_id
                       WHERE
                         posts.id = $1`;
  try {
    const result = await client.query(insertQuery, [postId]);
    res.status(200).json(result.rows[0]);
  } catch (error) {
    console.error('Error on get post:', error);
    res.status(500).send('Error on get post');
  }

  client.end;
})

app.get('/comments/:id', verifyToken, async (req, res) => {
  const postId = req.params.id
  const userId = req.user.id;

  const insertQuery = `
    WITH comment_likes AS (
      SELECT
        entity_id AS comment_id,
        COUNT(CASE WHEN vote_type = true THEN 1 END) AS like_count,
        COUNT(CASE WHEN vote_type = false THEN 1 END) AS dislike_count
      FROM votes
      WHERE entity_type = 'comment'
      GROUP BY entity_id
    ),
    user_likes AS (
      SELECT
        entity_id AS comment_id,
        vote_type
      FROM votes
      WHERE entity_type = 'comment' AND user_id = $2
    )
    SELECT
      comments.*,
      "usersReg".u_name,
      COALESCE(comment_likes.like_count, 0) AS like_count,
      COALESCE(comment_likes.dislike_count, 0) AS dislike_count,
      user_likes.vote_type AS user_vote
    FROM comments
    INNER JOIN "usersReg" ON comments.user_id = "usersReg".id
    LEFT JOIN comment_likes ON comments.id = comment_likes.comment_id
    LEFT JOIN user_likes ON comments.id = user_likes.comment_id
    WHERE comments.post_id = $1
    ORDER BY comments.created_at;
  `
  try {
    const result = await client.query(insertQuery, [postId, userId]);
    const comments = result.rows;

    const map = new Map();
    const roots = [];
    comments.forEach(comment => {
      map.set(comment.id, { ...comment, replies: [] });
    });
    comments.forEach(comment => {
      if (comment.parent_comment_id) {
        const parent = map.get(comment.parent_comment_id);
        if (parent) {
          parent.replies.push(map.get(comment.id));
        }
      } else {
        roots.push(map.get(comment.id));
      }
    });

    res.status(200).json(roots);
  } catch (error) {
    console.error('Error on get comments:', error);
    res.status(500).send('Error on get comments');
  }

  client.end;
});

app.post('/comments', verifyToken, async (req, res) => {
  const { postId, content, parent_comment_id } = req.body;

  const user_id = req.user.id

  const insertQuery = `INSERT INTO "comments" (post_id, content,parent_comment_id ,user_id) VALUES($1, $2, $3,$4) RETURNING *`;

  try {
    const result = await client.query(insertQuery, [postId, content, parent_comment_id, user_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on add post:', err);
    res.status(500).send('Error on add post');
  }
})

app.post('/votes', verifyToken, async (req, res) => {
  const { entity_id, entity_type, vote_type } = req.body;

  const user_id = req.user.id

  const insertQuery = `INSERT INTO "votes" (user_id, entity_id, entity_type, vote_type)
    VALUES($1, $2, $3, $4)
    ON CONFLICT (user_id, entity_id, entity_type)
    DO UPDATE SET vote_type = EXCLUDED.vote_type
    RETURNING *`;

  try {
    const result = await client.query(insertQuery, [user_id, entity_id, entity_type, vote_type]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on add post:', err);
    res.status(500).send('Error on add post');
  }
})

app.delete('/votes', verifyToken, async (req, res) => {
  const { entity_id, entity_type } = req.body;

  const user_id = req.user.id;

  const deleteQuery = `DELETE FROM "votes"
    WHERE user_id = $1 AND entity_id = $2 AND entity_type = $3
    RETURNING *`;

  try {
    const result = await client.query(deleteQuery, [user_id, entity_id, entity_type]);

    if (result.rowCount === 0) {
      return res.status(404).send('Vote not found');
    }


    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on delete vote:', err);
    res.status(500).send('Error on delete vote');
  }
});

app.get('/chats', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Token not found');
  }
  const user_id = req.user.id;

  try {
    const query = `
      SELECT chats.id AS chat_id, chats.name
      FROM chats
      JOIN chat_users ON chats.id = chat_users.chat_id
      WHERE chat_users.user_id = $1;
    `;

    const result = await client.query(query, [user_id]);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on get chats:', err);
    res.status(500).send('Error on get chats');
  }
})

/* app.post('/chats', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Token not found');
  }
  const user_id = req.user.id;

  try {
    const query = `
    INSERT INTO chats (name,is_private)
    VALUES ($1, $2)
    RETURNING *
    `;

    const result = await client.query(query, ['New chat', true]);

    if (result.rows[0].id) {
      const query = `
    INSERT INTO chat_users (chat_id,user_id)
    VALUES ($1, $2)
    RETURNING *
    `;
      const result = await client.query(query, [result.rows[0].id, user_id]);
    }
    console.log(result.rows);

    res.status(200).json(result.rows);
  } catch (err) {
    console.error('Error on get chats:', err);
    res.status(500).send('Error on get chats');
  }
})
 */

app.post('/chats', verifyToken, async (req, res) => {
  console.log(req.body);

  if (!req.user) {
    return res.status(401).send('Token not found');
  }
  const user_id = req.user.id;
  const { other_user_id, chat_name } = req.body;

  if (!other_user_id || !chat_name) {
    return res.status(400).send('Both other_user_id and chat_name are required');
  }

  try {
    // Вставка нового чата
    const chatResult = await client.query(
      'INSERT INTO chats (name, is_private) VALUES ($1, $2) RETURNING *',
      [chat_name, true]
    );
    const chatId = chatResult.rows[0].id;

    // Вставка пользователя в чат
    await client.query(
      'INSERT INTO chat_users (chat_id, user_id) VALUES ($1, $2)',
      [chatId, user_id]
    );

    // Вставка другого пользователя в чат
    await client.query(
      'INSERT INTO chat_users (chat_id, user_id) VALUES ($1, $2)',
      [chatId, other_user_id]
    );

    res.status(200).json(chatResult.rows[0]);
  } catch (err) {
    console.error('Error creating chat:', err);
    res.status(500).send('Error creating chat');
  }
});

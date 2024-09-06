const express = require('express');
const bodyParser = require('body-parser')

const cors = require('cors')
const bcrypt = require('bcryptjs')
const client = require('./connection')
const jwt = require('jsonwebtoken')
client.connect();
const app = express();
app.use(cors());
app.use(bodyParser.json());


const port = process.env.PORT || 3000
app.listen(port, () => {
  console.log(`Sever is now listening at port ${port}`);
})


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
  const { title, description } = req.body;

  const user_id = req.user.id

  const insertQuery = `INSERT INTO posts(title, content, user_id) VALUES($1, $2, $3) RETURNING *`;

  try {
    const result = await client.query(insertQuery, [title, description, user_id]);
    res.status(200).json(result.rows[0]);
  } catch (err) {
    console.error('Error on add post:', err);
    res.status(500).send('Error on add post');
  }
})


app.get('/posts', verifyToken, async (req, res) => {
  if (!req.user) {
    return res.status(401).send('Token not found');
  }

  try {
    const query = 'SELECT * FROM posts';
    client.query(query, (err, result) => {
      if (!err) {
        res.status(200).json(result.rows);
      }
    });
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

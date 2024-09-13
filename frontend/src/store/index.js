import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

export const useStore = defineStore('store', () => {
  const isAuth = ref(false)
  const posts = ref(null)
  const router = useRouter();
  const userInfo = ref(null)

  const checkToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      isAuth.value = false
      router.push("/login");
      console.error("No token found");
      return
    }
    isAuth.value = true
    return token;
  }

  const loginUser = async (email, password) => {
    const response = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        password
      }),
    });

    if (!response.ok) {
      return console.error("Registration failed:", await response.text());
    }

    const { token } = await response.json();
    localStorage.setItem("token", `Bearer ${token}`);
    router.push("/posts");
  };

  const registerUser = async (email, name, password) => {
    const response = await fetch("http://localhost:3000/register", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({
        email,
        name,
        password
      }),
    });

    if (!response.ok) {
      return console.error("Registration failed:", await response.text());
    }
    const data = await response.json();
    router.push("/login");
  };

  const getUserInfo = async () => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/userinfo", {
        method: "GET",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const { user } = await response.json();
      const { u_password, ...data } = await user
      userInfo.value = data

    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }
  };


  const createPost = async (formData) => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          Authorization: token
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }
      const post = await response.json()

      post.likes_count = 0
      post.dislikes_count = 0
      post.user_vote = null

      posts.value.unshift(post)
    } catch (err) {
      err.value = err.message;
    }


  };

  const getPosts = async () => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/posts", {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get post");
      }
      posts.value = await response.json()

    } catch (err) {
      err.value = err.message;
    }

  };

  const getSinglePost = async (id) => {

    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/posts/${id}`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get post");
      }


      const data = await response.json()
      return data

    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };

  const getComments = async (id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/comments/${id}`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get comments");
      }

      const data = await response.json()
      return data
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };

  const addComment = async (postId, content, parent_comment_id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/comments`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          postId, content, parent_comment_id
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add comments");
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };


  const addVote = async (entity_id, entity_type, vote_type) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/votes`, {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          entity_id, entity_type, vote_type
        })
      });

      if (!response.ok) {
        throw new Error("Failed to add votes");
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };

  const deleteVote = async (entity_id, entity_type) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/votes`, {
        method: "DELETE",
        headers: {
          Authorization: token,
          "Content-Type": "application/json"
        },
        body: JSON.stringify({
          entity_id, entity_type
        })
      });

      if (!response.ok) {
        throw new Error("Failed to delete votes");
      }

      const data = await response.json()

      return data
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };


  const addVoteToPost = async (is_like, target_id, entity_type) => {
    const newVote = is_like ? 1 : 0;
    const findPost = posts.value.find((post) => post.id === target_id);

    if (!findPost) {
      console.error('Post not found');
      return;
    }


    if (findPost.user_vote === newVote) {
      findPost.user_vote = null;
      if (is_like) {
        findPost.likes_count -= 1;
      } else {
        findPost.dislikes_count -= 1;
      }
      await deleteVote(target_id, entity_type);
    } else {

      if (findPost.user_vote !== null) {
        if (is_like) {
          findPost.likes_count += 1;
          findPost.dislikes_count -= 1;
        } else {
          findPost.likes_count -= 1;
          findPost.dislikes_count += 1;
        }
      } else {

        if (is_like) {
          findPost.likes_count += 1;
        } else {
          findPost.dislikes_count += 1;
        }
      }

      findPost.user_vote = newVote;
      await addVote(target_id, entity_type, is_like);
    }
  };


  return {
    isAuth,
    posts,
    userInfo,
    loginUser,
    registerUser,
    createPost,
    getPosts,
    getSinglePost,
    getUserInfo,
    checkToken,
    getComments,
    addComment,
    addVote,
    addVoteToPost,
    deleteVote
  }
})

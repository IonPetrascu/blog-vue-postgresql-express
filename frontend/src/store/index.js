import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';

export const useStore = defineStore('store', () => {
  const isAuth = ref(false)
  const posts = ref(null)
  const router = useRouter();


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

      return user;
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }
  };


  const createPost = async (title, description) => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/posts", {
        method: "POST",
        headers: {
          Authorization: token,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          title,
          description
        }),
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }
      const post = await response.json()
      posts.value = [...posts.value, post]
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
      console.log(data);

      return data
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };



  return {
    isAuth,
    posts,
    loginUser,
    registerUser,
    createPost,
    getPosts,
    getSinglePost,
    getUserInfo,
    checkToken,
    getComments,
    addComment
  }
})

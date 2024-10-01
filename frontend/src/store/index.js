import { defineStore } from 'pinia'
import { ref } from 'vue'
import { useRouter } from 'vue-router';
import { googleLogout } from "vue3-google-login";

export const useStore = defineStore('store', () => {
  const isAuth = ref(false)
  const posts = ref(null)
  const router = useRouter();
  const userInfo = ref(null)
  const profile = ref(null)

  const checkToken = () => {
    const token = localStorage.getItem('token')
    if (!token) {
      isAuth.value = false
      router.push("/login");
      console.error("No token found");
      return null
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
    await getMyInfo();
    router.push("/");
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

  const getMyInfo = async () => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/userinfo`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (response.status === 401) {
        isAuth.value = false
        router.push("/login");
        throw new Error("Failed to fetch your info");
      }

      const { user } = await response.json();
      userInfo.value = user
      return user
    } catch (err) {
      return { error: err.message };
    }
  };

  const getUserInfo = async (id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/profile/${id}`, {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to fetch user info");
      }

      const data = await response.json();
      profile.value = data
      posts.value = [...data.posts]

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
      return post
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

  const deletePost = async (post_id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/posts/${post_id}`, {
        method: "DELETE",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed delete post");
      }
      const data = await response.json()

      posts.value = posts.value.filter((post) => post.id !== post_id)

      if (profile.value && profile.value.posts) {
        profile.value.posts = profile.value.posts.filter((post) => post.id !== post_id);
      }
      return data
    } catch (err) {
      console.error(err);
      return err;
    }

  };

  const getMyChats = async () => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/chats", {
        method: "GET",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to get post");
      }
      const chats = await response.json()
      return chats
    } catch (err) {
      err.value = err.message;
    }

  };

  const createChat = async (other_user_id, chat_name) => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/chats", {
        method: "POST",
        headers: {
          Authorization: token,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          other_user_id, chat_name
        })
      });

      switch (response.status) {
        case 200:
          const existingChatData = await response.json();
          return { success: true, message: "Chat already exists", chat: existingChatData.chat };
        case 201:
          const createdChatData = await response.json();
          return { success: true, message: "Chat created", chat: createdChatData };
        case 400:
          const badRequestMessage = await response.text();
          return { success: false, message: badRequestMessage };
        case 401:
          return { success: false, message: "Unauthorized" };
        case 500:
          console.log("Server error");
          return { success: false, message: "Server error" };
        default:
          console.log("Unexpected status:", response.status);
          return { success: false, message: "Unexpected error" };
      }
    } catch (err) {
      console.log("Error creating chat:", err);
      return { success: false, message: "Network or server error" };

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

  const subscribeToUser = async (subscribed_to_id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/subscriptions/${subscribed_to_id}`, {
        method: "POST",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe on user");
      }

      const data = await response.json()
      profile.value.subscribers.push(data)
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };

  const deleteSubscription = async (subscribed_to_id) => {
    try {
      const token = checkToken();

      const response = await fetch(`http://localhost:3000/subscriptions/${subscribed_to_id}`, {
        method: "DELETE",
        headers: {
          Authorization: token
        }
      });

      if (!response.ok) {
        throw new Error("Failed to subscribe on user");
      }

      const data = await response.json()
      profile.value.subscribers = profile.value.subscribers.filter((sub) => sub.subscriber_id !== data.subscriber_id)
    } catch (err) {
      console.error(err.message);
      return { error: err.message };
    }

  };

  const checkCredential = (response) => {
    if (response && response.credential) {
      const credential = response.credential;

      sendTokenToServer(credential);
    } else {
      console.error("No credential found in response:", response);
    }
  };

  const sendTokenToServer = async (credential) => {
    try {
      const response = await fetch("http://localhost:3000/api/auth/google", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ token: credential }),
      });

      const result = await response.json();
      if (result.usertToken) {
        localStorage.setItem("token", `Bearer ${result.usertToken}`);
        await getMyInfo();
        router.push("/");
      }
    } catch (error) {
      console.error("Error sending token to server:", error);
    }
  };

  const logout = () => {
    let confirmExit = confirm("Are you sure you want to exit?");

    if (!confirmExit) return

    isAuth.value = false
    localStorage.clear('token')
    router.push('/login')
    googleLogout();
  }


  const changeProfileImg = async (formData) => {
    try {
      const token = checkToken();

      const response = await fetch("http://localhost:3000/profile-img", {
        method: "PATCH",
        headers: {
          Authorization: token
        },
        body: formData,
      });

      if (!response.ok) {
        throw new Error("Failed to add post");
      }

      const data = await response.json();

      profile.value.user.img = data.user.img;
      return data
    } catch (err) {
      err.value = err.message;
    }


  };



  return {
    isAuth,
    posts,
    userInfo,
    profile,
    loginUser,
    registerUser,
    createPost,
    getPosts,
    getSinglePost,
    deletePost,
    getUserInfo,
    checkToken,
    getComments,
    addComment,
    addVote,
    addVoteToPost,
    deleteVote,
    getMyChats,
    createChat,
    subscribeToUser,
    deleteSubscription,
    getMyInfo,
    checkCredential,
    logout,
    changeProfileImg
  }
})

import { createAsyncThunk, createSlice } from "@reduxjs/toolkit";

const initialPosts = [
  {
    id: 1,
    title: "My First Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 2,
    title: "My 2nd Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 3,
    title: "My 3rd Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
  {
    id: 4,
    title: "My Fourth Post",
    datetime: "July 01, 2021 11:17:36 AM",
    body: "Lorem ipsum dolor sit amet consectetur adipisicing elit. Quis consequatur expedita, assumenda similique non optio! Modi nesciunt excepturi corrupti atque blanditiis quo nobis, non optio quae possimus illum exercitationem ipsa!",
  },
];

const state = {
  status: "idle",
  posts: [],
  error: null,
};

export const postsSlice = createSlice({
  name: "posts",
  initialState: state,
  reducers: {
    addPost: (state, action) => {
      state.posts.push(action.payload);
    },
    deletePost: (state, action) => {
      state.posts = state.posts.filter((post) => post.id !== action.payload.id);
    },
    editPost: (state, action) => {
      state.posts = state.posts.map((post) =>
        post.id === action.payload.id ? { ...action.payload } : post
      );
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchPosts.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(fetchPosts.fulfilled, (state, action) => {
        state.status = "success";
        state.posts = action.payload;
      })
      .addCase(fetchPosts.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      });
    builder
      .addCase(editPostAsync.pending, (state) => {
        state.status = "pending";
        state.error = null;
      })
      .addCase(editPostAsync.fulfilled, (state, action) => {
        state.status = "success";
        state.posts = state.posts.map((post) =>
          post.id === action.payload.id ? { ...action.payload } : post
        );
      })
      .addCase(editPostAsync.rejected, (state, action) => {
        state.status = "fail";
        state.error = action.error.message;
      });
  },
});

export const fetchPosts = createAsyncThunk(
  "posts/fetchPost",
  async (_, { rejectWithValue }) => {
    const response = await fetch("https://nt-lessons.onrender.com/posts");
    const data = await response.json();
    if (response.status < 200 || 300 <= response.status) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const editPostAsync = createAsyncThunk(
  "posts/editPostAync",
  async (post, { rejectWithValue }) => {
    const response = await fetch(
      `https://nt-lessons.onrender.com/posts/${post.id}`,
      {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(post),
      }
    );
    const data = await response.json();
    if (response.status < 200 || 300 <= response.status) {
      return rejectWithValue(data);
    }
    return data;
  }
);

export const { addPost, deletePost, editPost } = postsSlice.actions;
export default postsSlice.reducer;

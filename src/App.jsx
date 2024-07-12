import Header from "./components/Header";
import Nav from "./components/Nav";
import Footer from "./components/Footer";
import Home from "./components/Home";
import NewPost from "./components/NewPost";
import PostPage from "./components/PostPage";
import About from "./components/About";
import Missing from "./components/Missing";
import { Routes, useNavigate, Route } from "react-router-dom";
import { useState, useEffect } from "react";
import { format } from "date-fns";

import { useDispatch, useSelector } from "react-redux";
import {
  addPost,
  deletePost,
  fetchPosts,
  editPostAsync,
} from "./store/postsSlice";

function App() {
  const { status, posts, error } = useSelector((state) => state.postsReducer);
  const dispatch = useDispatch();

  console.log({ status, posts, error });

  const [search, setSearch] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [postTitle, setPostTitle] = useState("");
  const [postBody, setPostBody] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    dispatch(fetchPosts());
  }, []);

  useEffect(() => {
    const filteredResults = posts.filter(
      (post) =>
        post.body.toLowerCase().includes(search.toLowerCase()) ||
        post.title.toLowerCase().includes(search.toLowerCase())
    );

    setSearchResults(filteredResults.reverse());
  }, [posts, search]);

  const handleSubmit = (e) => {
    e.preventDefault();
    const id = posts.length ? posts[posts.length - 1].id + 1 : 1;
    const datetime = format(new Date(), "MMMM dd, yyyy pp");
    const newPost = { id, title: postTitle, datetime, body: postBody };

    dispatch(addPost(newPost));
    setPostTitle("");
    setPostBody("");
    navigate("/");
  };

  const handleDelete = (id) => {
    dispatch(deletePost({ id }));
    navigate("/");
  };

  // const handleEdit = (id) => {
  //   const post = posts.find((post) => post.id === id);
  //   console.log({ post });
  // };

  return (
    <div className='App'>
      <Header title='React JS Blog' />
      <Nav search={search} setSearch={setSearch} />
      {status === "pending" && <p>Loading...</p>}
      {status === "rejected" && <p style={{ color: "red" }}>Error: {error}</p>}
      <Routes>
        <Route path='/' element={<Home posts={searchResults} />} />
        <Route
          path='/post'
          element={
            <NewPost
              handleSubmit={handleSubmit}
              postTitle={postTitle}
              setPostTitle={setPostTitle}
              postBody={postBody}
              setPostBody={setPostBody}
            />
          }
        />
        <Route
          path='/post/:id'
          element={
            <PostPage
              posts={posts}
              handleDelete={handleDelete}
            />
          }
        />
        <Route path='/about' component={<About />} />
        <Route path='*' component={<Missing />} />
      </Routes>
      <Footer />
    </div>
  );
}

export default App;

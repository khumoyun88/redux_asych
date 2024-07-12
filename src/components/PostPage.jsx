import { useEffect, useState } from "react";
import { useDispatch } from "react-redux";
import { useParams, Link, useNavigate } from "react-router-dom";
import { editPostAsync } from "../store/postsSlice";

const PostPage = ({ posts, handleDelete }) => {
  const [edit, setEdit] = useState(false);
  const [title, setTitle] = useState(false);
  const [body, setBody] = useState(false);

  const { id } = useParams();
  const post = posts.find((post) => post.id.toString() === id);

  useEffect(() => {
    if (post) {
      setTitle(post.title);
      setBody(post.body);
    }
  }, [post]);

  const navigate = useNavigate();
  const dispatch = useDispatch();

  return (
    <main className='PostPage'>
      <article className='post'>
        {post ? (
          <>
            {edit ? (
              <form>
                <input
                  type='text'
                  value={title}
                  onChange={(e) => setTitle(e.target.value)}
                />
                <textarea
                  rows={5}
                  name='postBody'
                  onChange={(e) => setBody(e.target.value)}
                  value={body}
                />
              </form>
            ) : (
              <>
                <h2>{post.title}</h2>
                <p className='postDate'>{post.datetime}</p>
                <p className='postBody'>{post.body}</p>
              </>
            )}
            <div className='post-buttons'>
              <button className='danger' onClick={() => handleDelete(post.id)}>
                Delete Post
              </button>
              <button
                onClick={() => {
                  if (edit) {
                    dispatch(
                      editPostAsync({
                        ...post,
                        title,
                        body,
                      })
                    );
                  }

                  setEdit(!edit);
                }}
              >
                {edit ? "Save" : "Edit"}
              </button>
              <button onClick={() => navigate(-1)}>Cancel</button>
            </div>
          </>
        ) : (
          <>
            <h2>Post Not Found</h2>
            <p>Well, that's disappointing.</p>
            <p>
              <Link to='/'>Visit Our Homepage</Link>
            </p>
          </>
        )}
      </article>
    </main>
  );
};

export default PostPage;

import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import CommentsModal from "./CommentsModal";
import Navbar from "./Navbar";
export default function MyPosts() {
  const { logout, user } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [showCommentsPost, setShowCommentsPost] = useState(null);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);
  const [likeLoading, setLikeLoading] = useState({});

  const fetchMyPosts = async (pageNum) => {
    try {
      const res = await api.get(`/posts/getMyPosts?page=${pageNum}&per_page=5`);
      setPosts(res.data.posts || res.data); // adjust based on API
    } catch (err) {
      console.error(err);
    }
  };

  const handleLike = async (post) => {
    setLikeLoading((prev) => ({ ...prev, [post.id]: true }));
    try {
      if (post.liked_by_current_user) {
        await api.delete('/likes/deleteLike', { data: { post_id: post.id } });
      } else {
        await api.post('/likes/createLike', { post_id: post.id });
      }
      fetchMyPosts(page);
    } catch (err) {
      console.error(err);
    } finally {
      setLikeLoading((prev) => ({ ...prev, [post.id]: false }));
    }
  };

  useEffect(() => {
    fetchMyPosts(page);
  }, [page]);

  const handleDeletePost = async (id) => {
    await api.delete("/posts/deletePost", { data: { id } });
    fetchMyPosts(page);
  };

  const handleShowComments = async (post) => {
    setCommentsLoading(true);
    try {
      const res = await api.post(
        '/posts/getComments',
        { post_id: post.id },
        {
          headers: {
            'username': user?.username || '',
            'password': user?.password || '',
          },
        }
      );
      // Always pass only the comments array
      setComments(Array.isArray(res.data.comments) ? res.data.comments : []);
    } catch (err) {
      setComments([]);
      console.error(err);
    } finally {
      setCommentsLoading(false);
      setShowCommentsPost(post);
    }
  };

  const handleDeleteComment = async (commentId) => {
    try {
      await api.delete(
        '/comments/deleteComment',
        {
          data: { id: commentId },
          headers: {
            'username': user?.username || '',
            'password': user?.password || '',
          },
        }
      );
      // Refresh comments for the current post
      if (showCommentsPost) {
        handleShowComments(showCommentsPost);
      }
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div>
      <h2>My Posts</h2>
      <Navbar />
      <button onClick={logout}>Logout</button>
      {posts.map((post) => (
        <div key={post.id} style={{ border: "1px solid black", margin: 10, padding: 10 }}>
          <p>{post.blog_text}</p>
          <div style={{ display: 'flex', alignItems: 'center', gap: 10 }}>
            <button
              onClick={() => handleLike(post)}
              disabled={likeLoading[post.id]}
              className={`btn btn-sm btn-outline-secondary me-2`}
              style={post.liked_by_current_user ? { color: "#dc3545", borderColor: "#dc3545" } : {}}
            >
              <span style={post.liked_by_current_user ? { color: "#dc3545", fontWeight: 600 } : {}}>❤</span> Like ({post.likes_count})
            </button>
            <button className="btn btn-sm btn-outline-danger me-2" onClick={() => handleDeletePost(post.id)}>Delete Post</button>
            <button className="btn btn-sm btn-outline-primary" onClick={() => handleShowComments(post)} disabled={commentsLoading}>
              {commentsLoading ? 'Loading...' : 'Comments'}
            </button>
          </div>
          {/* Inline comments below the buttons if this post is selected */}
          {showCommentsPost && showCommentsPost.id === post.id && (
            <div style={{ marginTop: 10, borderTop: '1px solid #eee', paddingTop: 10 }}>
              <h5>Comments</h5>
              {commentsLoading && <div>Loading comments...</div>}
              {!commentsLoading && comments.length === 0 && <div>No comments yet.</div>}
              {!commentsLoading && comments.map((c) => (
                <div key={c.id} style={{ marginBottom: 5, display: 'flex', alignItems: 'center', gap: 8 }}>
                  <span>{c.comment}</span>
                  {(c.user_id === user.id || post.user_id === user.id) && (
                    <button className="btn btn-sm btn-outline-danger" onClick={() => handleDeleteComment(c.id)}>
                      Delete
                    </button>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      ))}

      <div>
        <button disabled={page === 1} onClick={() => setPage(page - 1)}>Prev</button>
        <span> Page {page} </span>
        <button onClick={() => setPage(page + 1)}>Next</button>
      </div>
    </div>
  );
}

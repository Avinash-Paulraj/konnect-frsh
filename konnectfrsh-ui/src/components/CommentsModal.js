import { useEffect, useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function CommentsModal({ post, onClose, comments }) {
  const { user } = useContext(AuthContext);
  const [commentsState, setCommentsState] = useState(comments || []);
  const [newComment, setNewComment] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const fetchComments = async () => {
    setLoading(true);
    setError("");
    try {
      const res = await api.post(
        "/posts/getComments",
        { post_id: post.id },
        {
          headers: {
            username: user?.username || "",
            password: user?.password || "",
          },
        }
      );
      setCommentsState(res.data.comments || res.data || []);
    } catch (err) {
      setCommentsState([]);
      setError("Failed to load comments.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleAddComment = async () => {
    setError("");
    try {
      await api.post(
        "/comments/createComment",
        { post_id: post.id, comment: newComment },
        {
          headers: {
            username: user?.username || "",
            password: user?.password || "",
          },
        }
      );
      setNewComment("");
      fetchComments();
    } catch (err) {
      setError("Failed to add comment.");
      console.error(err);
    }
  };

  const handleDeleteComment = async (id) => {
    setError("");
    try {
      await api.delete(
        "/comments/deleteComment",
        {
          data: { id },
          headers: {
            username: user?.username || "",
            password: user?.password || "",
          },
        }
      );
      fetchComments();
    } catch (err) {
      setError("Failed to delete comment.");
      console.error(err);
    }
  };

  useEffect(() => {
    if (!comments) fetchComments();
  }, [post.id, comments]);

  return (
    <div style={{ border: "1px solid gray", padding: 10, marginTop: 10 }}>
      <h4>Comments</h4>
      {loading && <div>Loading comments...</div>}
      {error && <div style={{ color: 'red' }}>{error}</div>}
      {!loading && Array.isArray(commentsState) && commentsState.length === 0 && <div>No comments yet.</div>}
      {!loading && Array.isArray(commentsState) && commentsState.map((c) => (
        <div key={c.id} style={{ marginBottom: '8px' }}>
          <div>
            <span style={{ fontWeight: 'bold' }}>{c.username}:</span>
            <span style={{ marginLeft: '8px' }}>{c.comment}</span>
          </div>
          <div style={{ fontSize: '0.85em', color: '#555' }}>
            {c.commented_date ? new Date(c.commented_date).toLocaleString() : ''}
          </div>
          {(c.user_id === user.id || post.user_id === user.id) && (
            <button onClick={() => handleDeleteComment(c.id)}>Delete</button>
          )}
        </div>
      ))}
      <input value={newComment} onChange={(e) => setNewComment(e.target.value)} placeholder="Add comment"/>
      <button onClick={handleAddComment} disabled={!newComment.trim()}>Add</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

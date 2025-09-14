import { useState, useContext, useEffect } from "react";
import CommentsModal from "./CommentsModal";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";

export default function PostItem({ post, fetchPosts }) {
  const { user } = useContext(AuthContext);
  // Use liked_by_current_user from API
  const [liked, setLiked] = useState(post.liked_by_current_user || false);
  useEffect(() => {
    setLiked(post.liked_by_current_user || false);
  }, [post.liked_by_current_user]);
  const [likesCount, setLikesCount] = useState(post.likes_count || 0);
  const [showComments, setShowComments] = useState(false);
  const [comments, setComments] = useState([]);
  const [commentsLoading, setCommentsLoading] = useState(false);

  const handleLike = async () => {
    if (liked) {
      await api.delete(`/likes/deleteLike`, { data: { post_id: post.id } });
      setLiked(false);
      setLikesCount(likesCount - 1);
    } else {
      await api.post(`/likes/createLike`, { post_id: post.id });
      setLiked(true);
      setLikesCount(likesCount + 1);
    }
    // if (fetchPosts) fetchPosts();
  };

  const handleShowComments = async () => {
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
      setComments(res.data.comments || res.data);
    } catch (err) {
      setComments([]);
      console.error(err);
    } finally {
      setCommentsLoading(false);
      setShowComments(true);
    }
  };

  return (
    <div className="card h-100 shadow-sm">
      <div className="card-body">
        <p className="card-text">{post.blog_text}</p>
        <button
          onClick={handleLike}
          className={`btn btn-sm btn-outline-secondary me-2`}
          style={liked ? { color: "#dc3545", borderColor: "#dc3545" } : {}}
        >
          <span style={liked ? { color: "#dc3545", fontWeight: 600 } : {}}>❤</span> Like ({likesCount})
        </button>
        <button
          className="btn btn-sm btn-outline-primary"
          onClick={handleShowComments}
          disabled={commentsLoading}
        >
          {commentsLoading ? 'Loading...' : 'Comments'}
        </button>
        {showComments && <CommentsModal post={post} comments={comments} onClose={() => setShowComments(false)} />}
      </div>
    </div>
  );
}

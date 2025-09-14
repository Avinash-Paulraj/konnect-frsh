import { useState, useEffect, useContext } from "react";
import api from "../api/api";
import PostItem from "./PostItem";
import AddPostModal from "./AddPostModal";
import { AuthContext } from "../context/AuthContext";
import Navbar from "./Navbar";

export default function PostsList() {
  const { logout } = useContext(AuthContext);
  const [posts, setPosts] = useState([]);
  const [page, setPage] = useState(1);
  const [totalPosts, setTotalPosts] = useState(0);
  const [showAddPost, setShowAddPost] = useState(false);

  const fetchPosts = async (pageNum) => {
    const res = await api.get(`/posts/listPosts?page=${pageNum}&per_page=5`);
    setPosts(res.data.posts);
    setTotalPosts(res.data.posts.length); // could adjust if API returns total count
  };

  useEffect(() => {
    fetchPosts(page);
  }, [page]);

  return (
    <div className="container py-4">
      <Navbar />
      <div className="d-flex justify-content-between align-items-center mb-3">
        <h2 className="mb-0">Posts</h2>
        <div>
          <button className="btn btn-success me-2" onClick={() => setShowAddPost(true)}>Add Post</button>
          <button className="btn btn-outline-danger" onClick={logout}>Logout</button>
        </div>
      </div>
      <div className="row g-3">
        {posts.map((post) => (
          <div className="col-md-6 col-lg-4" key={post.id}>
            <PostItem post={post} fetchPosts={fetchPosts} />
          </div>
        ))}
      </div>
      <div className="d-flex justify-content-center align-items-center mt-4">
        <button className="btn btn-secondary me-2" disabled={page === 1} onClick={() => setPage(page-1)}>Prev</button>
        <span className="mx-2">Page {page}</span>
        <button className="btn btn-secondary" onClick={() => setPage(page+1)}>Next</button>
      </div>
      {showAddPost && <AddPostModal onClose={() => setShowAddPost(false)} fetchPosts={fetchPosts} />}
    </div>
  );
}

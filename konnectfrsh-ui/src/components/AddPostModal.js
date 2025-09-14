import { useState } from "react";
import api from "../api/api";

export default function AddPostModal({ onClose, fetchPosts }) {
  const [text, setText] = useState("");

  const handleAddPost = async () => {
    await api.post("/posts/createPost", { blog_text: text });
    onClose();
    fetchPosts(1);
  };

  return (
    <div style={{ border: "1px solid gray", padding: 10 }}>
      <textarea value={text} onChange={(e) => setText(e.target.value)} placeholder="Write your post"/>
      <button onClick={handleAddPost}>Post</button>
      <button onClick={onClose}>Close</button>
    </div>
  );
}

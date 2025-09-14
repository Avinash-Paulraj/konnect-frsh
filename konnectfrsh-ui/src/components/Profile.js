

import { useState, useContext } from "react";
import api from "../api/api";
import { AuthContext } from "../context/AuthContext";
import { useNavigate } from "react-router-dom";


export default function Profile() {
  const { user, login } = useContext(AuthContext);
  const navigate = useNavigate();
  const [password, setPassword] = useState(user.password);
  const [about, setAbout] = useState(user.about);
  const [message, setMessage] = useState("");

  const handleUpdate = async () => {
    await api.put("/users/updateUser", { name: user.name, password, about });
    login({ ...user, password, about });
    setMessage("Updated successfully");
  };

  return (
    <div className="container py-4">
      <div className="row justify-content-center">
        <div className="col-md-7 col-lg-6">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
              <h3 className="mb-0">Profile</h3>
              <button className="btn btn-light btn-sm" onClick={() => navigate('/posts')}>
                &larr; Go Home
              </button>
            </div>
            <div className="card-body">
              <div className="mb-3">
                <label className="form-label fw-bold">Username:</label>
                <div className="form-control-plaintext">{user.name}</div>
              </div>
              <div className="mb-3">
                <label className="form-label fw-bold">DOB:</label>
                <div className="form-control-plaintext">{user.dob}</div>
              </div>
              <form onSubmit={e => {e.preventDefault(); handleUpdate();}}>
                <div className="mb-3">
                  <label className="form-label">About Me</label>
                  <textarea
                    className="form-control"
                    value={about}
                    onChange={(e) => setAbout(e.target.value)}
                    rows={4}
                  />
                </div>
                <div className="mb-3">
                  <label className="form-label">Change Password</label>
                  <input
                    className="form-control"
                    type="password"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    placeholder="New password"
                  />
                </div>
                <button type="submit" className="btn btn-primary w-100">Update</button>
                {message && <div className="alert alert-success mt-3">{message}</div>}
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

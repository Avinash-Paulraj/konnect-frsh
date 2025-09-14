import { useState } from "react";
import { useNavigate, Link } from "react-router-dom";
import api from "../api/api";

export default function Register() {
  const navigate = useNavigate();
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [dob, setDob] = useState("");
  const [about, setAbout] = useState("");
  const [error, setError] = useState("");

  const handleRegister = async () => {
    try {
      await api.post("/users/createUser", { name, password, dob, about });
      navigate("/");
    } catch (err) {
      setError(err.response?.data?.errors?.join(", ") || "Registration failed");
    }
  };

  return (
    <div className="container py-5">
      <div className="row justify-content-center">
        <div className="col-md-6 col-lg-5">
          <div className="card shadow-sm">
            <div className="card-header bg-primary text-white">
              <h3 className="mb-0">Register</h3>
            </div>
            <div className="card-body">
              <form onSubmit={e => {e.preventDefault(); handleRegister();}}>
                <div className="mb-3">
                  <label className="form-label">Username</label>
                  <input className="form-control" placeholder="Username" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Password</label>
                  <input className="form-control" placeholder="Password" type="password" value={password} onChange={(e) => setPassword(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">Date of Birth</label>
                  <input className="form-control" type="date" value={dob} onChange={(e) => setDob(e.target.value)} />
                </div>
                <div className="mb-3">
                  <label className="form-label">About</label>
                  <textarea className="form-control" placeholder="About" value={about} onChange={(e) => setAbout(e.target.value)} />
                </div>
                <button type="submit" className="btn btn-primary w-100">Register</button>
                {error && <div className="alert alert-danger mt-3">{error}</div>}
              </form>
              <p className="mt-3 text-center">Already have an account? <Link to="/">Login</Link></p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

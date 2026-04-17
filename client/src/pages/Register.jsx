import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { saveAuth } from "../utils/auth";

function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    role: "student",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/register", form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Registration failed");
    }
  };

  return (
    <main className="container page narrow auth-shell">
      <h2>Create Account</h2>
      <p className="meta">Choose student or instructor role and start with a fully responsive experience.</p>
      <form className="card form" onSubmit={submit}>
        <label>
          Full name
          <input
            type="text"
            placeholder="Your name"
            value={form.name}
            onChange={(e) => setForm({ ...form, name: e.target.value })}
            required
          />
        </label>
        <label>
          Email
          <input
            type="email"
            placeholder="you@example.com"
            value={form.email}
            onChange={(e) => setForm({ ...form, email: e.target.value })}
            required
          />
        </label>
        <label>
          Password
          <input
            type="password"
            placeholder="Create a password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        <label>
          Role
          <select
            value={form.role}
            onChange={(e) => setForm({ ...form, role: e.target.value })}
          >
            <option value="student">Student</option>
            <option value="instructor">Instructor</option>
          </select>
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" type="submit">Register</button>
      </form>
    </main>
  );
}

export default Register;

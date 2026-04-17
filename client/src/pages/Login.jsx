import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";
import { saveAuth } from "../utils/auth";

function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/auth/login", form);
      saveAuth(data);
      navigate("/dashboard");
    } catch (err) {
      setError(err.response?.data?.message || "Login failed");
    }
  };

  return (
    <main className="container page narrow auth-shell">
      <h2>Login</h2>
      <p className="meta">Welcome back. Continue your learning or manage your teaching dashboard.</p>
      <form className="card form" onSubmit={submit}>
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
            placeholder="Enter your password"
            value={form.password}
            onChange={(e) => setForm({ ...form, password: e.target.value })}
            required
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" type="submit">Login</button>
      </form>
    </main>
  );
}

export default Login;

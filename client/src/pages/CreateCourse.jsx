import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { api } from "../api";

function CreateCourse() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    title: "",
    description: "",
    category: "Programming",
    thumbnailUrl: "",
  });
  const [error, setError] = useState("");

  const submit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const { data } = await api.post("/courses", form);
      navigate(`/courses/${data._id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Course creation failed");
    }
  };

  return (
    <main className="container page narrow auth-shell">
      <h2>Create Course</h2>
      <p className="meta">Set up your course details, then add lessons and video uploads from the manage page.</p>
      <form className="card form" onSubmit={submit}>
        <label>
          Course title
          <input
            type="text"
            placeholder="MERN Development Bootcamp"
            value={form.title}
            onChange={(e) => setForm({ ...form, title: e.target.value })}
            required
          />
        </label>
        <label>
          Course description
          <textarea
            placeholder="What students will learn in this course"
            value={form.description}
            onChange={(e) => setForm({ ...form, description: e.target.value })}
            rows={5}
          />
        </label>
        <label>
          Category
          <input
            type="text"
            placeholder="Programming"
            value={form.category}
            onChange={(e) => setForm({ ...form, category: e.target.value })}
          />
        </label>
        <label>
          Thumbnail URL (optional)
          <input
            type="url"
            placeholder="https://example.com/thumbnail.png"
            value={form.thumbnailUrl}
            onChange={(e) => setForm({ ...form, thumbnailUrl: e.target.value })}
          />
        </label>
        {error && <p className="error">{error}</p>}
        <button className="btn primary" type="submit">Create</button>
      </form>
    </main>
  );
}

export default CreateCourse;

import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { api } from "../api";
import { getUser } from "../utils/auth";

function Dashboard() {
  const user = getUser();
  const [courses, setCourses] = useState([]);
  const [myCourses, setMyCourses] = useState([]);
  const [error, setError] = useState("");

  useEffect(() => {
    const load = async () => {
      try {
        const [allRes, myRes] = await Promise.all([
          api.get("/courses"),
          user?.role === "instructor" ? api.get("/courses/mine") : Promise.resolve({ data: [] }),
        ]);

        setCourses(allRes.data);
        setMyCourses(myRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Unable to load courses");
      }
    };

    load();
  }, [user?.role]);

  return (
    <main className="container page stack-lg">
      <section className="dashboard-header">
        <h2>{user?.role === "instructor" ? "Instructor Dashboard" : "Student Dashboard"}</h2>
        {user && <p className="meta">Logged in as {user.name} ({user.role})</p>}
      </section>

      <section className="stats-grid">
        <article className="stat-card">
          <p className="meta">Total Published Courses</p>
          <strong>{courses.length}</strong>
        </article>
        <article className="stat-card">
          <p className="meta">Your Role</p>
          <strong>{user?.role || "Guest"}</strong>
        </article>
        {user?.role === "instructor" && (
          <article className="stat-card">
            <p className="meta">Your Courses</p>
            <strong>{myCourses.length}</strong>
          </article>
        )}
      </section>

      {error && <p className="error">{error}</p>}

      {user?.role === "instructor" && (
        <section className="stack-lg">
          <div className="section-header">
            <h3>My Courses</h3>
            <Link className="btn secondary" to="/create-course">Create New</Link>
          </div>
          <div className="grid">
            {myCourses.map((course) => (
              <article className="card course-card" key={course._id}>
                <h4>{course.title}</h4>
                <p>{course.description}</p>
                <Link className="btn secondary" to={`/courses/${course._id}`}>Manage Course</Link>
              </article>
            ))}
            {myCourses.length === 0 && <p>No courses created yet.</p>}
          </div>
        </section>
      )}

      <section className="stack-lg">
        <h3>All Published Courses</h3>
        <div className="grid">
          {courses.map((course) => (
            <article className="card course-card" key={course._id}>
              <h4>{course.title}</h4>
              <p>{course.description}</p>
              <p className="meta">Instructor: {course.instructor?.name || "Unknown"}</p>
              <Link className="btn primary" to={`/courses/${course._id}`}>Open Course</Link>
            </article>
          ))}
          {courses.length === 0 && <p>No courses available yet.</p>}
        </div>
      </section>
    </main>
  );
}

export default Dashboard;

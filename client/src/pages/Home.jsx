import { Link } from "react-router-dom";

function Home() {
  return (
    <main className="container page">
      <section className="hero">
        <div>
          <span className="hero-kicker">For Students And Instructors</span>
          <h1>Teach smarter and learn faster with one platform</h1>
          <p>
            Build engaging courses, upload lessons, and track your learning journey with a clean and mobile-ready online classroom.
          </p>
          <div className="hero-actions">
            <Link to="/register" className="btn primary">Start Teaching</Link>
            <Link to="/dashboard" className="btn ghost">Explore Courses</Link>
          </div>
        </div>

        <aside className="hero-panel">
          <h3>What you get</h3>
          <div className="hero-stats">
            <div className="hero-stat">
              <strong>100%</strong>
              <span>Mobile responsive layout</span>
            </div>
            <div className="hero-stat">
              <strong>2 Roles</strong>
              <span>Student and instructor journeys</span>
            </div>
            <div className="hero-stat">
              <strong>Video</strong>
              <span>Lesson upload and playback</span>
            </div>
          </div>
        </aside>
      </section>

      <section className="page stack-lg">
        <div className="split">
          <article className="card">
            <h3>Student Experience</h3>
            <p className="meta">Discover published courses, open lesson videos, and continue learning from any device.</p>
          </article>
          <article className="card">
            <h3>Instructor Workspace</h3>
            <p className="meta">Create courses, upload video lessons, and manage your content from one dashboard.</p>
          </article>
        </div>
      </section>
    </main>
  );
}

export default Home;

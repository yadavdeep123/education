import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import { api } from "../api";
import { getUser } from "../utils/auth";

function CourseDetails() {
  const { id } = useParams();
  const user = getUser();
  const [course, setCourse] = useState(null);
  const [lessonForm, setLessonForm] = useState({
    title: "",
    description: "",
    duration: "",
  });
  const [videoFile, setVideoFile] = useState(null);
  const [status, setStatus] = useState("");
  const [error, setError] = useState("");

  const loadCourse = async () => {
    try {
      const { data } = await api.get(`/courses/${id}`);
      setCourse(data);
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load course");
    }
  };

  useEffect(() => {
    loadCourse();
  }, [id]);

  const canManage =
    user && course && (user.role === "admin" || user.id === course.instructor?._id);

  const uploadAndAddLesson = async (e) => {
    e.preventDefault();
    setError("");
    setStatus("Uploading video...");

    if (!videoFile) {
      setError("Please select a video file");
      setStatus("");
      return;
    }

    try {
      const fileData = new FormData();
      fileData.append("video", videoFile);

      const uploadRes = await api.post("/upload/video", fileData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      setStatus("Video uploaded. Saving lesson...");

      await api.post(`/courses/${id}/lessons`, {
        ...lessonForm,
        videoUrl: uploadRes.data.videoUrl,
      });

      setStatus("Lesson added successfully");
      setLessonForm({ title: "", description: "", duration: "" });
      setVideoFile(null);
      await loadCourse();
    } catch (err) {
      setStatus("");
      setError(err.response?.data?.message || "Failed to add lesson");
    }
  };

  if (!course) {
    return (
      <main className="container page">
        {error ? <p className="error">{error}</p> : <p>Loading course...</p>}
      </main>
    );
  }

  return (
    <main className="container page stack-lg">
      <section className="card stack-lg">
        <h2>{course.title}</h2>
        <p>{course.description}</p>
        <p className="meta">Category: {course.category}</p>
      </section>

      {canManage && (
        <section className="card">
          <h3>Add Lesson + Upload Video</h3>
          <form className="form" onSubmit={uploadAndAddLesson}>
            <label>
              Lesson title
              <input
                type="text"
                placeholder="Introduction to the Course"
                value={lessonForm.title}
                onChange={(e) => setLessonForm({ ...lessonForm, title: e.target.value })}
                required
              />
            </label>
            <label>
              Lesson description
              <textarea
                placeholder="Give students a short overview of this lesson"
                rows={4}
                value={lessonForm.description}
                onChange={(e) => setLessonForm({ ...lessonForm, description: e.target.value })}
              />
            </label>
            <label>
              Duration in minutes
              <input
                type="number"
                placeholder="15"
                value={lessonForm.duration}
                onChange={(e) => setLessonForm({ ...lessonForm, duration: e.target.value })}
              />
            </label>
            <label>
              Video file
              <input
                type="file"
                accept="video/mp4,video/webm,video/quicktime"
                onChange={(e) => setVideoFile(e.target.files?.[0] || null)}
                required
              />
            </label>
            {status && <p className="status">{status}</p>}
            {error && <p className="error">{error}</p>}
            <button className="btn primary" type="submit">Upload Lesson</button>
          </form>
        </section>
      )}

      <section className="stack-lg">
        <h3>Course Lessons</h3>
        <div className="lessons-grid">
          {course.lessons.map((lesson) => (
            <article className="card course-card" key={lesson._id}>
              <h4>{lesson.title}</h4>
              <p>{lesson.description}</p>
              <p className="meta">Duration: {lesson.duration} minutes</p>
              <video className="lesson-video" controls src={lesson.videoUrl} />
            </article>
          ))}
          {course.lessons.length === 0 && <p>No lessons yet.</p>}
        </div>
      </section>
    </main>
  );
}

export default CourseDetails;

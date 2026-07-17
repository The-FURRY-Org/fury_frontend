import { useEffect, useState } from "react";
import { useAuth } from "../context/AuthContext";
import AlertMessage from "../components/AlertMessage";
import LoadingSpinner from "../components/LoadingSpinner";
import { educationService } from "../services/educationService";

const EduCollect = () => {
  const { user } = useAuth();
  const [videos, setVideos] = useState([]);
  const [loading, setLoading] = useState(true);
  const [message, setMessage] = useState("");
  const [form, setForm] = useState({ title: "", description: "", video: null });

  const loadVideos = () => {
    educationService.list().then((response) => setVideos(response.data)).finally(() => setLoading(false));
  };

  useEffect(() => {
    loadVideos();
  }, []);

  const handleSubmit = async (event) => {
    event.preventDefault();
    const data = new FormData();
    data.append("title", form.title);
    data.append("description", form.description);
    if (form.video) data.append("video", form.video);

    try {
      await educationService.upload(data);
      setMessage("Video uploaded successfully.");
      setForm({ title: "", description: "", video: null });
      loadVideos();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Upload failed.");
    }
  };

  const handleDelete = async (videoId) => {
    if (!window.confirm("Delete this educational video?")) return;

    try {
      await educationService.remove(videoId);
      setMessage("Video deleted successfully.");
      loadVideos();
    } catch (error) {
      setMessage(error?.response?.data?.message || "Delete failed.");
    }
  };

  return (
    <>
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h1 className="h3">EduCollect</h1>
          <p className="text-muted">Watch and learn proper waste disposal habits.</p>
        </div>
      </div>
      <AlertMessage type="success" message={message} />
      {user?.role === "admin" && (
        <div className="content-card mb-4">
          <h2 className="h5">Upload new training video</h2>
          <form onSubmit={handleSubmit} className="row g-3">
            <div className="col-md-6">
              <input
                className="form-control"
                placeholder="Video title"
                value={form.title}
                onChange={(e) => setForm({ ...form, title: e.target.value })}
                required
              />
            </div>
            <div className="col-md-6">
              <input
                className="form-control"
                type="file"
                accept="video/*"
                onChange={(e) => setForm({ ...form, video: e.target.files[0] })}
                required
              />
            </div>
            <div className="col-12">
              <textarea
                className="form-control"
                placeholder="Description"
                rows="3"
                value={form.description}
                onChange={(e) => setForm({ ...form, description: e.target.value })}
              ></textarea>
            </div>
            <div className="col-12">
              <button className="btn btn-ecocollect">Upload Video</button>
            </div>
          </form>
        </div>
      )}
      {loading ? (
        <LoadingSpinner />
      ) : (
        <div className="row g-4">
          {videos.map((video) => (
            <div className="col-md-6" key={video.id}>
              <div className="content-card">
                <div className="d-flex justify-content-between align-items-start gap-2">
                  <div>
                    <h2 className="h5">{video.title}</h2>
                    <p className="text-muted mb-3">Uploaded by {video.uploaded_by_name}</p>
                  </div>
                  {user?.role === "admin" && (
                    <button className="btn btn-outline-danger btn-sm" onClick={() => handleDelete(video.id)}>
                      Delete
                    </button>
                  )}
                </div>
                <video className="w-100" controls src={video.video_url} />
                <p className="mt-3">{video.description}</p>
              </div>
            </div>
          ))}
          {!videos.length && <div className="col-12 text-muted">No training videos available yet.</div>}
        </div>
      )}
    </>
  );
};

export default EduCollect;

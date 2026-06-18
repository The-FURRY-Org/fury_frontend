const About = () => (
  <main className="container py-5">
    <div className="row justify-content-center">
      <div className="col-lg-8">
        <h1>About EcoCollect</h1>
        <p className="lead">
          EcoCollect is a community-driven web application that connects residents (clients) with garbage collectors to enable proper waste disposal in the community of Bugujju, Mukono.
        </p>
        <div className="content-card mt-4">
          <h2 className="h5">What EcoCollect does</h2>
          <p>
            The system allows clients to request rubbish collection, collectors to accept and complete jobs, and administrators to oversee operations, process payments via Mobile Money, and resolve complaints.
          </p>
          <p className="mb-0">
            EcoCollect promotes proper waste management habits through education, real-time tracking via Google Maps, and a feedback system that builds trust between clients and collectors.
          </p>
        </div>
      </div>
    </div>
  </main>
);

export default About;

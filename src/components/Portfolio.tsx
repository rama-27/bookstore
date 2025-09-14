import { useNavigate } from 'react-router-dom';
import './Portfolio.css';

const Portfolio = () => {
  const navigate = useNavigate();

  return (
    <div className="portfolio-container">
      <header className="portfolio-header">
        <div className="logo">RR</div>
        <nav className="portfolio-nav">
          <a href="#projects">Projects</a>
          <a href="#extras">Extras</a>
          <a href="#media">Media</a>
        </nav>
        <a href="#contact" className="contact-button">Contact Me</a>
      </header>

      <section className="intro-section">
        <div className="profile-picture">
          <img src="src/assets/rama.png" alt="Rama Raju Mantena" />
        </div>
        <h1>Hey, I'm <span className="highlight">Rama Raju Mantena</span>.</h1>
        <p>Here, you can check out what I'm working on. I try my best to create things with <span className="heart">❤️</span></p>
      </section>

      <section id="projects" className="projects-section">
        <h2>Projects</h2>
        <div className="projects-grid">
          <div className="project-item" onClick={() => navigate('/bookverse')} style={{ cursor: 'pointer' }}>
            <h3>BookVerse</h3>
            <p>A platform to explore and manage books.</p>
          </div>
          <div className="project-item">
            <h3>Weather App</h3>
            <p>A real-time weather forecasting app.</p>
          </div>
          <div className="project-item">
            <h3>Task Manager</h3>
            <p>An app to organize and manage your daily tasks.</p>
          </div>
        </div>
      </section>

      <section id="contact" className="contact-section">
        <h2>Contact Me</h2>
        <p>If you'd like to get in touch, feel free to reach out via email or connect with me on LinkedIn.</p>
        <div className="contact-links">
          <a href="mailto:ramaraju@example.com" className="contact-link">Email Me</a>
          <a href="https://www.linkedin.com/in/rama-raju-mantena" target="_blank" rel="noopener noreferrer" className="contact-link">LinkedIn</a>
        </div>
      </section>
    </div>
  );
};

export default Portfolio;

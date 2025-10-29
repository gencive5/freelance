import './App.css';

const Contact = () => (
  <footer className="footer">
    <div className="footer-left">
      <a
        href="mailto:vic.segen@gmail.com"
        className="link"
        style={{ color: '#1A73E8' }}
      >
        Email
      </a>
    </div>
    
    <div className="footer-right">
      <a
        href="https://instagram.com/gencive5"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
        style={{ color: '#5a2adeff' }}
      >
        Instagram
      </a>
    </div>
  </footer>
);

export default Contact;
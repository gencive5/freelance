import './App.css';

const Contact = () => (
  <footer className="footer">
    <div className="footer-left">
      <a
        href="mailto:vic.segen@gmail.com"
        className="link"
        style={{ color: '#02bebe' }}
      >
        email
      </a>
        <a
        href="https://instagram.com/gencive5"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
        style={{ color: '#02bebe' }}
      >
        instagram
      </a>
    </div>
    
    <div className="footer-right">
      <a
        href="https://sm00ch.xyz/"
        target="_blank"
        rel="noopener noreferrer"
        style={{ color: '#02bebe' }}
      >
        SM00CH
      </a>
    </div>
  </footer>
);

export default Contact;
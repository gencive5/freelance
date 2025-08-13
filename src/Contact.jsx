import './App.css';

const Contact = () => (
  <footer className="footer">

     <a
      href="mailto:vic.segen@gmail.com"
      className="mx-2 underline hover:opacity-80 transition-opacity"
      style={{ color: '#1A73E8' }}
    >
      Email
    </a>
  
    <a
      href="https://instagram.com/gencive5"
      target="_blank"
      rel="noopener noreferrer"
      style={{ color: '#ffffffff' }}
    >
      Instagram
    </a>
  </footer>
);

export default Contact;
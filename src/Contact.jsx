import './App.css';
import EmailIcon from './icons/EmailIcon'; 
import InstagramIcon from './icons/InstagramIcon';

const Contact = () => (
  <footer className="footer">
    <div className="footer-left">
      <a
        href="mailto:vic.segen@gmail.com"
        className="link"
      >
        <EmailIcon/>
      </a>
        <a
        href="https://instagram.com/gencive5"
        target="_blank"
        rel="noopener noreferrer"
        className="link"
        style={{marginLeft: '1rem' }}
      >
         <InstagramIcon/>
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
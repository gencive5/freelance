// src/App.jsx
import './App.css';
import ContactForm from './ContactForm';
import DistortedText from './DistortedText';

const App = () => {
  return (
    <div className="container">
      <div className="title-wrapper">
        <DistortedText 
          text="Gencives" 
          size={window.innerWidth > 768 ? 60 : 40}
        />
        <DistortedText 
          text="développeur créatif" 
          size={window.innerWidth > 768 ? 60 : 40}
        />
        <DistortedText 
          text="créatif" 
          size={window.innerWidth > 768 ? 60 : 40}
        />
      </div>

      <div style={{ padding: '20px' }} className="Figure-Demo">
        <span className="text-fit">
          <span><span>DEMANDEZ VOTRE SITE WEB MAINTENANT</span></span>
          <span aria-hidden="true">DEMANDEZ VOTRE SITE WEB MAINTENANT</span>
        </span>
      </div>
      
      <div className="Figure-Demo">
        <span className="text-fit">
          <span><span>Laissez vos coordonnées et je vous répondrai aujourd'hui</span></span>
          <span aria-hidden="true">Laissez vos coordonnées et je vous répondrai aujourd'hui</span>
        </span>
      </div>

      <ContactForm />
    </div>
  );
};

export default App;
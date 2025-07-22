// src/App.jsx
import './App.css';
import ContactForm from './ContactForm';
import DistortedText from './DistortedText';
import { useState, useEffect } from 'react';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return (
    <div className="container">
      <div className="title-wrapper">
        {isMobile ? (
          // Mobile layout
          <>
            <DistortedText 
              text="Gencives" 
              size={40}
            />
            <DistortedText 
              text="développeur" 
              size={40}
            />
             <DistortedText 
              text="créatif" 
              size={60}
            />
          </>
        ) : (
          // Desktop layout
          <>
            <DistortedText 
              text="Gencives" 
              size={60}
            />
            <DistortedText 
              text="développeur créatif" 
              size={60}
            />
           
          </>
        )}
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
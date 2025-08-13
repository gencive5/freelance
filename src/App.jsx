import './App.css';
import ContactForm from './ContactForm';
import DistortedText from './DistortedText';
import MetallicScrollbar from './MetallicScrollbar';
import { useState, useEffect } from 'react';
import Contact from './Contact';
import MetallicCursor from './MetallicCursor';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const handleMetallicClick = () => {
    console.log('Metallic button clicked!');
  };

  return (
    <MetallicScrollbar style={{
      '--scrollbar-bg': '#ffffffff',
      '--scrollbar-metal': 'silver',
      '--convexity': 2
    }}>
      <MetallicCursor />

      <div className="container">
        <div className="Figure-Demo overlay-text">
  <div className="text-column">
    <span className="text-fit">
      <span><span>GENCIVES</span></span>
      <span aria-hidden="true">GENCIVES</span>
    </span>
    <span className="text-fit">
      <span><span>développeur créatif</span></span>
      <span aria-hidden="true">développeur créatif</span>
    </span>
  </div>
</div>

         <div className="content-wrapper">
          {isMobile ? (
            // Mobile layout
            <>
              <DistortedText className="title-wrapper"
                text="Gencives" 
              />
            </>
          ) : (
            // Desktop layout
            <>
              <DistortedText className="title-gap"
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

{isMobile ? (
        <div className="Figure-Demo">
          <span className="text-fit">
            <span><span>design - image de marque</span></span>
            <span aria-hidden="true">design - image de marque</span>
          </span>
          <span className="text-fit">
            <span><span>développement</span></span>
            <span aria-hidden="true">développement</span>
          </span>
          <span className="text-fit">
            <span><span>typographie</span></span>
            <span aria-hidden="true">typographie</span>
          </span>
        </div>

        ) : (

          <div className="Figure-Demo">
          <span className="text-fit">
            <span><span>design - image de marque - développement - typographie</span></span>
            <span aria-hidden="true">design - image de marque - développement - typographie</span>
          </span>
        </div>
        
      

        )}

        <div className="Figure-Demo">
          <span className="text-fit">
            <span><span>DEMANDEZ VOTRE SITE WEB MAINTENANT</span></span>
            <span aria-hidden="true">DEMANDEZ VOTRE SITE WEB MAINTENANT</span>
          </span>
        </div>
        
        <div className="Figure-Demo">
          <span className="text-fit">
            <span><span>Laissez moi vos coordonnées et je vous contacterai</span></span>
            <span aria-hidden="true">Laissez moi vos coordonnées et je vous contacterai</span>
          </span>
        </div>
        

        <ContactForm />
        <br></br>
        <Contact></Contact>
      </div>
    </MetallicScrollbar>
    
  );
};

export default App;
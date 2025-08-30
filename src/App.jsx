import './App.css';
import './MetallicButton.css';
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
        {/* First Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-first-row">
            <div className="overlay-text">
              <div className="flexcontainer">
                <div className="text-column Figure-Demo">
                  <span className="text-fit">
                    <span><span>gencives</span></span>
                    <span aria-hidden="true">gencives</span>
                  </span>
                  <span className="text-fit">
                    <span><span>développeur créatif</span></span>
                    <span aria-hidden="true">développeur créatif</span>
                  </span>
                  <span className="text-fit">
                <span><span>design - image de marque - développement - typographie</span></span>
                <span aria-hidden="true">design - image de marque - développement - typographie</span>
              </span>
                </div>
            
              </div>
              
            </div>

            <div className="content-wrapper">
              <DistortedText className="title-gap" text="Gencives" />
              <DistortedText text="développeur créatif" />
            </div>

           
          </div>
        )}

        {/* Mobile layout remains the same */}
        {isMobile && (
          <>
            <div className="overlay-text">
              <div className="flexcontainer">
                <div className="text-column Figure-Demo">
                  <span className="text-fit">
                    <span><span>gencives</span></span>
                    <span aria-hidden="true">gencives</span>
                  </span>
                  <span className="text-fit">
                    <span><span>développeur créatif</span></span>
                    <span aria-hidden="true">développeur créatif</span>
                  </span>
                </div>
              </div>
            </div>

            <div className="content-wrapper">
              <DistortedText className="title-wrapper" text="Gencives" />
            </div>

            <div className="Figure-Demo">
              <span className="text-fit">
                <span><span>design - développement web</span></span>
                <span aria-hidden="true">design - développement web</span>
              </span>
              <span className="text-fit">
                <span><span>identité visuelle - typographie</span></span>
                <span aria-hidden="true">identité visuelle - typographie</span>
              </span>
            </div>

            <div className="Figure-Demo">
              <span className="text-fit">
                <span><span>Parlez moi de votre projet</span></span>
                <span aria-hidden="true">Parlez moi de votre projet</span>
              </span>
            </div>

            <ContactForm />
            <br />
            <Contact />
          </>
        )}

        {/* Second Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-second-row">
            <div className="Figure-Demo">
              <span className="text-fit">
                <span><span>Parlez moi de votre projet</span></span>
                <span aria-hidden="true">Parlez moi de votre projet</span>
              </span>
            </div>
            
            <ContactForm />
          </div>
        )}

        {/* Third Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-third-row">
            <Contact />
          </div>
        )}
      </div>
    </MetallicScrollbar>
  );
};

export default App;
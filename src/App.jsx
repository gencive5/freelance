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

       <main role="main">

      <div className="container">
        {/* First Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-first-row">
            <div className="overlay-text">
              <div className="flexcontainer">
                <div className="text-column Figure-Demo">
                  {/* gencives - will stay at top */}
                  <div className="text-fit1"> 
                    <span className="text-fit">
                      <span><span>gencives</span></span>
                      <span aria-hidden="true">gencives</span>
                    </span>
                  </div>
                  
                  {/* développeur créatif - will go to bottom */}
                  <span className="text-fit">
                    <span><span>développement créatif</span></span>
                    <span aria-hidden="true">développement créatif</span>
                  </span>
                  
                  {/* design line - will go to bottom */}
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
            <div className="mobile-first-row">
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
                      <span><span>design - développement web</span></span>
                      <span aria-hidden="true">design - développement web</span>
                    </span>
                    <span className="text-fit">
                      <span><span>identité visuelle - typographie</span></span>
                      <span aria-hidden="true">identité visuelle - typographie</span>
                    </span>
                  </div>
                </div>
              </div>

              <div className="content-wrapper">
                <DistortedText className="title-wrapper" text="Contactez" />
              </div>
            </div>

            <div className="mobile-second-row">

              <div className="background-distorted-text">
                <DistortedText 
                  text="Envoyez"
                  color="#02bebe"
                  speed={0.5}          // Faster
                  volatility={0.1}     // More distortion
                  seed={0.3}           // Different pattern
                  baseSize={50}        // Slightly larger
                />
              </div>     

              <ContactForm />
              
              <Contact />
            </div>
          </>
        )}

        {/* Second Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-second-row">
           <div className="background-distorted-text">
              <DistortedText 
                text="Envoyez"
                color="#02bebe"
                speed={0.6}          // Faster
                volatility={0.2}     // More distortion  
                seed={0.5}           // Different pattern
                baseSize={70}        // Slightly larger
              />
            </div>
            
            <ContactForm />
            <Contact />
          </div>
        )}
      </div>

      </main>
      
    </MetallicScrollbar>
  );
};

export default App;
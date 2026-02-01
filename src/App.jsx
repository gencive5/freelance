import './App.css';
import './MetallicButton.css';
import ContactForm from './ContactForm';
import Distortion from './Distortion';
// import MetallicScrollbar from './MetallicScrollbar';
import { useState, useEffect } from 'react';
import MetallicCursor from './MetallicCursor';



const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

useEffect(() => {


  const setVh = () => {






    document.documentElement.style.setProperty(
      '--vh',
      `${window.innerHeight * 0.01}px`
    );
  };

  setVh(); // Set on load





  window.addEventListener('resize', setVh);
  if (!isFirefoxAndroid) {
  window.addEventListener('resize', setVh);
}
  return () => window.removeEventListener('resize', setVh);
}, []);

const isFirefoxAndroid = /Android.*Firefox/i.test(navigator.userAgent);
useEffect(() => {
  if (!/Android.*Firefox/i.test(navigator.userAgent)) return;

  const onFocus = () => {
    document.documentElement.classList.add('ff-input-focus');
  };

  const onBlur = () => {
    document.documentElement.classList.remove('ff-input-focus');
  };

  document.addEventListener('focusin', onFocus);
  document.addEventListener('focusout', onBlur);

  return () => {
    document.removeEventListener('focusin', onFocus);
    document.removeEventListener('focusout', onBlur);
  };
}, []);


  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);


  return (

    // <MetallicScrollbar style={{
    //   '--scrollbar-bg': '#ffffffff',
    //   '--scrollbar-metal': 'silver',
    //   '--convexity': 2
    // }}>
      // <MetallicCursor />

       <main role="main">

      <div className="container">
        {/* First Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-first-row">
            <div className="overlay-text">
              <div className="flexcontainer">
                <div className="text-column Figure-Demo">
                  <div className="text-fit1"> 
                    <span className="text-fit">
                      <span><span>gencives</span></span>
                      <span aria-hidden="true">gencives</span>
                    </span>
                  </div>
                  
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
              <Distortion
  text="observation"
  fontFamily="sm00ch"
  fontSize={120}
  speed={0.6}
  volatility={0.25}
/>

            </div>
          </div>
        )}

        {/* Mobile layout */}
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
                <Distortion
  text="observation"
  fontFamily="sm00ch"
  fontSize={120}
  speed={0.6}
  volatility={0.25}
/>

              </div>
            </div>

            <div className="mobile-second-row">

              <ContactForm />
            </div>
          </>
        )}

        {/* Second Row - Only on Desktop */}
        {!isMobile && (
          <div className="desktop-second-row">
                    
            <ContactForm />
         
            
          </div>
        )}
      </div>

      </main>
      
    // </MetallicScrollbar>
  );
};

export default App;
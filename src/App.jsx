import './App.css';
import './MetallicCursor.css';
import ContactForm from './ContactForm';
import Distortion from './Distortion';
import MetallicScrollbar from './MetallicScrollbar';
import { useState, useEffect } from 'react';
import MetallicCursor from './MetallicCursor';

const App = () => {
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const [isFirefoxMobile, setIsFirefoxMobile] = useState(false);
  
    // State for background color
  const [bgColor, setBgColor] = useState('var(--color-primary)');

  // Apply background color to body when it changes
  useEffect(() => {
    console.log('Background color changing to:', bgColor);
    document.body.style.backgroundColor = bgColor;
    document.documentElement.style.backgroundColor = bgColor;
    
    // Also update any container elements
    const container = document.querySelector('.container');
    if (container) {
      container.style.backgroundColor = bgColor;
    }
  }, [bgColor]);

  // Handle link hover events
  const handleLinkHover = (color, linkName) => {
    console.log(`Hovering over: ${linkName}, setting color to: ${color}`);
    setBgColor(color);
  };

  const handleLinkLeave = () => {
    console.log('Leaving link, resetting to default color');
    setBgColor('var(--color-primary)');
  };

  // Detect if it's Firefox on mobile
  useEffect(() => {
    const detectFirefoxMobile = () => {
      const userAgent = navigator.userAgent || navigator.vendor || window.opera;
      const isFirefox = /firefox|fxios/i.test(userAgent);
      const isMobileDevice = /android|webos|iphone|ipad|ipod|blackberry|windows phone/i.test(userAgent);
      setIsFirefoxMobile(isFirefox && isMobileDevice);
    };

    detectFirefoxMobile();
    window.addEventListener('resize', detectFirefoxMobile);
    return () => window.removeEventListener('resize', detectFirefoxMobile);
  }, []);

  // Only set --vh for non-Firefox mobile browsers
  useEffect(() => {
    const setVh = () => {
      // Don't set --vh on Firefox mobile
      if (!isFirefoxMobile) {
        document.documentElement.style.setProperty(
          '--vh',
          `${window.innerHeight * 0.01}px`
        );
      }
    };

    setVh(); // Set on load
    window.addEventListener('resize', setVh);
    return () => window.removeEventListener('resize', setVh);
  }, [isFirefoxMobile]);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  // Handle Firefox mobile input focus/blur for better scrolling
  useEffect(() => {
    if (!isFirefoxMobile) return;

    const handleFocus = () => {
      document.documentElement.classList.add('firefox-mobile-input-focus');
    };

    const handleBlur = () => {
      document.documentElement.classList.remove('firefox-mobile-input-focus');
    };

    // Add listeners to all inputs and textareas
    const inputs = document.querySelectorAll('input, textarea');
    inputs.forEach(input => {
      input.addEventListener('focus', handleFocus);
      input.addEventListener('blur', handleBlur);
    });

    return () => {
      inputs.forEach(input => {
        input.removeEventListener('focus', handleFocus);
        input.removeEventListener('blur', handleBlur);
      });
    };
  }, [isFirefoxMobile]);

  
  return (

    <MetallicScrollbar style={{
      '--scrollbar-bg': '#ffffffff',
      '--scrollbar-metal': 'silver',
      '--convexity': 2
    }}>
      <MetallicCursor />

       <main role="main">

      <div className="container">
      
        {/* Desktop */}
        {/* First Row - Desktop */}
        {!isMobile && (
  <div className="desktop-content">
    <div className="distort-wrapper">
      <Distortion
        text="welcome"
        fontFamily="sm00ch"
        fontSize={120}
        speed={0.6}
        volatility={0.25}
      />
    </div>
    
    {/* First Row - Desktop */}
    <div className="desktop-first-row">
      <div className="overlay-text">
        <div className="flexcontainer">
          <div className="text-column Figure-Demo">
            <div className="text-fit-name"> 
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
              <span><span>design • identité • développement front-end • typographie</span></span>
              <span aria-hidden="true">design • identité • développement front-end • typographie</span>
            </span>
          </div>
        </div>
      </div>
    </div>
    
    {/* Second Row - Desktop */}
    <div className="project-wrapper">
      <div className="overlay-text">
      <span 
          className="text-fit rat"
          onMouseEnter={() => handleLinkHover('var(--color-rat)', 'mr-rat')}
          onMouseLeave={handleLinkLeave}
          onTouchStart={() => handleLinkHover('var(--color-rat)', 'mr-rat')}
          onTouchEnd={handleLinkLeave}
          style={{ pointerEvents: 'auto' }}
        >
        <span><span>https://mr-rat.netlify.app/</span></span>
        <span aria-hidden="true">https://mr-rat.netlify.app/</span>
      </span>   
            <span 
        className="text-fit eviljis"
        onMouseEnter={() => handleLinkHover('var(--color-eviljis)', 'eviljis')}
        onMouseLeave={handleLinkLeave}
        onTouchStart={() => handleLinkHover('var(--color-eviljis)', 'eviljis')}
        onTouchEnd={handleLinkLeave}
        style={{ pointerEvents: 'auto' }}
      >
        <span><span>https://eviljis.netlify.app/</span></span>
        <span aria-hidden="true">https://eviljis.netlify.app/</span>
      </span>   
            <span 
        className="text-fit tender"
        onMouseEnter={() => handleLinkHover('var(--color-tender)', 'tender')}
        onMouseLeave={handleLinkLeave}
        onTouchStart={() => handleLinkHover('var(--color-tender)', 'tender')}
        onTouchEnd={handleLinkLeave}
        style={{ pointerEvents: 'auto' }}
      >
        <span><span>https://tendrr.netlify.app/</span></span>
        <span aria-hidden="true">https://tendrr.netlify.app/</span>
      </span>   
    </div>
    </div>
  </div>
)}

{/* Third Row - Desktop Contact Form */}
{!isMobile && (
          <div className="desktop-contact-row">
            <ContactForm />
          </div>
        )}
      

        {/* Mobile layout */}
        {isMobile && (
  <>
  
      <div className="distort-wrapper">
        <Distortion
          text="welcome"
          fontFamily="sm00ch"
          fontSize={120}
          speed={0.6}
          volatility={0.25}
        />
      </div>
      
      {/* First Row - Mobile */}
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
                <span><span>design • développement web</span></span>
                <span aria-hidden="true">design • développement web</span>
              </span>
              <span className="text-fit">
                <span><span>identité visuelle • typographie</span></span>
                <span aria-hidden="true">identité visuelle • typographie</span>
              </span>
            </div>
          </div>
        </div>
      </div>
      
      {/* Second Row - Mobile Links */}
      <div className="mobile-links-row">
        <div className="overlay-text">
          <div className="flexcontainer">
            <div className="text-column Figure-Demo">
                <span 
          className="text-fit rat"
          onMouseEnter={() => handleLinkHover('var(--color-rat)', 'mr-rat')}
          onMouseLeave={handleLinkLeave}
          onTouchStart={() => handleLinkHover('var(--color-rat)', 'mr-rat')}
          onTouchEnd={handleLinkLeave}
          style={{ pointerEvents: 'auto' }}
        >
          <span><span>mr-rat</span></span>
          <span aria-hidden="true">mr-rat</span>
        </span>   
        <span 
          className="text-fit eviljis"
          onMouseEnter={() => handleLinkHover('var(--color-eviljis)', 'eviljis')}
          onMouseLeave={handleLinkLeave}
          onTouchStart={() => handleLinkHover('var(--color-eviljis)', 'eviljis')}
          onTouchEnd={handleLinkLeave}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <span><span>eviljis</span></span>
          <span aria-hidden="true">eviljis</span>
        </span>   
                <span 
          className="text-fit tender"
          onMouseEnter={() => handleLinkHover('var(--color-tender)', 'tender')}
          onMouseLeave={handleLinkLeave}
          onTouchStart={() => handleLinkHover('var(--color-tender)', 'tender')}
          onTouchEnd={handleLinkLeave}
          style={{ cursor: 'pointer', pointerEvents: 'auto' }}
        >
          <span><span>tender</span></span>
          <span aria-hidden="true">tender</span>
        </span>   
      </div>
      </div>
      </div>
      </div>
      
  

    {/* Third Row - MobileContact Form */}
    <div className="mobile-second-row">
      <ContactForm />
    </div>
  </>
)}

      </div>
   
      </main>
      
    </MetallicScrollbar>
  );
};

export default App;
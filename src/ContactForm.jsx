import { useState, useEffect, useRef, useCallback } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import MetallicButton from './MetallicButton';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const buttonTextRef = useRef("ENVOYER"); // Using ref instead of state for text
  const textareaRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const buttonRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    
    // Anti-autocorrect measures
    [nameInputRef, emailInputRef, textareaRef].forEach(ref => {
      if (ref.current) {
        ref.current.setAttribute('autocorrect', 'off');
        ref.current.setAttribute('spellcheck', 'false');
        ref.current.setAttribute('autocapitalize', 'off');
      }
    });

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const updateButton = useCallback((text, type) => {
    if (buttonRef.current) {
      // Directly update the button's text content
      const textNode = buttonRef.current.querySelector('.button-text');
      if (textNode) {
        textNode.textContent = text;
      }
      
      // Update metal color if needed
      if (type) {
        buttonRef.current.style.setProperty(
          '--metal', 
          type === 'success' ? 'hsl(120, 30%, 50%)' :
          type === 'error' ? 'hsl(0, 30%, 50%)' : 'neutral'
        );
      }
    }
    buttonTextRef.current = text;
  }, []);

  const sendEmail = useCallback(async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    try {
      await emailjs.sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      );
      
      setStateMessage("Message envoyé!");
      setMessageType('success');
      updateButton("ENVOYÉ!", 'success');
      
      setTimeout(() => {
        setStateMessage(null);
        setMessageType(null);
        updateButton("ENVOYER", null);
      }, 5000);
    } catch (error) {
      setStateMessage("Erreur, veuillez rééssayer");
      setMessageType('error');
      updateButton("ENVOYER", 'error');
      
      setTimeout(() => {
        setStateMessage(null);
        setMessageType(null);
      }, 5000);
    } finally {
      setIsSubmitting(false);
      e.target.reset();
    }
  }, [updateButton]);

  return (
    <form onSubmit={sendEmail} className="contact-form">
      {/* Input fields remain the same as before */}
      <div className="contact-form__group">
        <label className="contact-form__label">Nom:</label>
        <input 
          ref={nameInputRef}
          type="text" 
          name="user_name" 
          required 
          className="contact-form__input"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="name"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">Email:</label>
        <input 
          ref={emailInputRef}
          type="email" 
          name="email" 
          required 
          className="contact-form__input"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="email"
        />
      </div>
      
      <div className="contact-form__group textarea-container">
        <label className="contact-form__label">Message:</label>
        <textarea 
          ref={textareaRef}
          name="message" 
          required 
          className="contact-form__textarea"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
        <MetallicTextareaScrollbar 
          textareaRef={textareaRef}
          style={{
            '--metal': 'silver',
            '--convexity': '1.5'
          }}
        />
      </div>
      
      <div className="contact-form__submit-container">
        <MetallicButton 
          ref={buttonRef}
          type="submit" 
          disabled={isSubmitting}
          style={{
            width: '100%',
            height: isMobile ? '60px' : '80px',
            fontSize: isMobile ? '1.5rem' : '2rem',
            borderRadius: '44px',
            '--metal': 'neutral',
            borderLeft: 'none',
            borderRight: 'none',
            fontFamily: '"Microsoft", sans-serif',
            color: 'white',
            textShadow: '0 -1px 0 rgba(0,0,0,0.5)',
            transition: '--metal 0.3s ease' // Smooth color transition
          }}
        >
          <span className="button-text">{buttonTextRef.current}</span>
        </MetallicButton>
        {stateMessage && messageType !== 'success' && (
          <p className={`contact-form__message contact-form__message--${messageType}`}>
            {stateMessage}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
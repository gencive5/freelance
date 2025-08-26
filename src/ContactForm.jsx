 import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import './ContactForm.css';
import MetallicButton from './MetallicButton';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const [messageType, setMessageType] = useState(null);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
  const textareaRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    window.addEventListener('resize', handleResize);
    
    // Extra anti-autocorrect measures
    if (nameInputRef.current) {
      nameInputRef.current.setAttribute('autocorrect', 'off');
      nameInputRef.current.setAttribute('spellcheck', 'false');
      nameInputRef.current.setAttribute('autocapitalize', 'off');
    }
    
    if (emailInputRef.current) {
      emailInputRef.current.setAttribute('autocorrect', 'off');
      emailInputRef.current.setAttribute('spellcheck', 'false');
    }
    
    if (textareaRef.current) {
      textareaRef.current.setAttribute('autocorrect', 'off');
      textareaRef.current.setAttribute('spellcheck', 'false');
      textareaRef.current.setAttribute('autocapitalize', 'off');
    }

    return () => window.removeEventListener('resize', handleResize);
  }, []);

  const sendEmail = (e) => {
    e.persist();
    e.preventDefault();
    setIsSubmitting(true);
    
    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        e.target,
        import.meta.env.VITE_PUBLIC_KEY
      )
      .then(
        (result) => {
          setStateMessage("ENVOYé!");
          setMessageType('success');
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
            setMessageType(null);
          }, 5000);
        },
        (error) => {
          setStateMessage("Erreur, veuillez rééssayer");
          setMessageType('error');
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
            setMessageType(null);
          }, 5000);
        }
      );
    
    e.target.reset();
  };

  return (
    <form onSubmit={sendEmail} className="contact-form">
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
  type="submit" 
  disabled={isSubmitting}
  style={{
    width: '100%',
    height: isMobile ? '60px' : '80px',
    fontSize: isMobile ? '1.5rem' : '2rem'
  }}
>
  {messageType === 'success' ? "ENVOYé!" : "ENVOYER"}
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
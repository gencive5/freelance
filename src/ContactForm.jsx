import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import MetallicButton from './MetallicButton';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  useEffect(() => {
    console.log({
      serviceId: import.meta.env.VITE_SERVICE_ID,
      templateId: import.meta.env.VITE_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_PUBLIC_KEY
    });
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
          setStateMessage("Message envoyé!");
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
          type="text" 
          name="user_name" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">Email:</label>
        <input 
          type="email" 
          name="user_email" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">Message:</label>
        <textarea 
          name="message" 
          required 
          className="contact-form__textarea"
        />
      </div>
      
      <div className="contact-form__submit-container" style={{ 
        display: 'flex', 
        justifyContent: 'center', 
        marginTop: '40px'
      }}>
        <MetallicButton 
          type="submit" 
          disabled={isSubmitting}
          style={{
            width: isMobile ? '180px' : '240px',
            height: isMobile ? '60px' : '80px',
            fontSize: isMobile ? '1rem' : '1.2rem',
            '--metal': messageType === 'success' ? 'hsl(120, 30%, 50%)' :
                      messageType === 'error' ? 'hsl(0, 30%, 50%)' : 'neutral'
          }}
        >
          {stateMessage || "Envoyer à vic.segen@gmail.com"}
        </MetallicButton>
      </div>
    </form>
  );
};

export default ContactForm;
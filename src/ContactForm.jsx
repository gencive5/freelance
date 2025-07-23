import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const [messageType, setMessageType] = useState(null); // 'success' or 'error'

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
      
      <div className="contact-form__submit-container">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className={`contact-form__submit ${
            messageType === 'success' ? 'contact-form__submit--success' : 
            messageType === 'error' ? 'contact-form__submit--error' : ''
          }`}
        >
          {stateMessage || "Envoyer à vic.segen@gmail.com"}
        </button>
      </div>
    </form>
  );
};

export default ContactForm;
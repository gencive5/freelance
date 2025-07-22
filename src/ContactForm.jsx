import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);

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
          setStateMessage("Message sent!");
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        },
        (error) => {
          setStateMessage("Something went wrong, please try again later or contact me directly at vic.segen@gmail.com");
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        }
      );
    
    e.target.reset();
  };

  return (
    <form onSubmit={sendEmail} className="contact-form">
      <div className="contact-form__group">
        <label className="contact-form__label">Name</label>
        <input 
          type="text" 
          name="user_name" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">Email</label>
        <input 
          type="email" 
          name="user_email" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">Message</label>
        <textarea 
          name="message" 
          required 
          className="contact-form__textarea"
        />
      </div>
      
      <div className="contact-form__group contact-form__submit-container">
        <button 
          type="submit" 
          disabled={isSubmitting} 
          className="contact-form__submit"
        >
          <span className="contact-form__submit-text">
            <span><span>Send to vic.segen@gmail.com</span></span>
            <span aria-hidden="true" style={{ display: 'none' }}>Send to vic.segen@gmail.com</span>
          </span>
        </button>
      </div>
      
      {stateMessage && (
        <p className={`contact-form__message ${
          stateMessage === "Message sent!" 
            ? 'contact-form__message--success' 
            : 'contact-form__message--error'
        }`}>
          {stateMessage}
        </p>
      )}
    </form>
  );
};

export default ContactForm;
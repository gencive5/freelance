import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const [sparkles, setSparkles] = useState([]);

  useEffect(() => {
    console.log({
      serviceId: import.meta.env.VITE_SERVICE_ID,
      templateId: import.meta.env.VITE_TEMPLATE_ID,
      publicKey: import.meta.env.VITE_PUBLIC_KEY
    });
  }, []);

  // Function to create sparkles
  const createSparkles = (e) => {
    const buttonRect = e.target.getBoundingClientRect();
    const newSparkles = [];
    
    for (let i = 0; i < 15; i++) {
      newSparkles.push({
        id: Math.random(),
        x: Math.random() * buttonRect.width,
        y: Math.random() * buttonRect.height,
        size: Math.random() * 10 + 5,
        opacity: Math.random() * 0.5 + 0.5,
        delay: Math.random() * 0.5,
        duration: Math.random() * 1 + 0.5
      });
    }
    
    setSparkles(newSparkles);
    setTimeout(() => setSparkles([]), 2000);
  };

  const sendEmail = (e) => {
    e.persist();
    e.preventDefault();
    setIsSubmitting(true);
    createSparkles(e); // Trigger sparkles on click
    
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
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        },
        (error) => {
          setStateMessage("Erreur, veuillez rééssayer ou envoyer un mail directement à vic.segen@gmail.com");
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
        <label className="contact-form__label">Nom</label>
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
            <span><span>Envoyer à vic.segen@gmail.com</span></span>
            <span aria-hidden="true" style={{ display: 'none' }}>Envoyer à vic.segen@gmail.com</span>
          </span>
          
          {/* Sparkle elements */}
          {sparkles.map(sparkle => (
            <span
              key={sparkle.id}
              className="sparkle"
              style={{
                position: 'absolute',
                left: `${sparkle.x}px`,
                top: `${sparkle.y}px`,
                width: `${sparkle.size}px`,
                height: `${sparkle.size}px`,
                opacity: sparkle.opacity,
                animationDelay: `${sparkle.delay}s`,
                animationDuration: `${sparkle.duration}s`
              }}
            />
          ))}
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
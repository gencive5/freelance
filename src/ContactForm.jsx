import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useLanguage } from './context/LanguageContext';
import './App.css';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [stateMessage, setStateMessage] = useState(null);
  const { language } = useLanguage();

  const translations = {
    name: {
      en: "Name",
      fr: "Nom",
      es: "Nombre"
    },
    email: {
      en: "Email",
      fr: "Email",
      es: "Correo electrónico"
    },
    message: {
      en: "Message",
      fr: "Message",
      es: "Mensaje"
    },
    send: {
      en: "Send",
      fr: "Envoyer",
      es: "Enviar"
    },
    success: {
      en: "Message sent!",
      fr: "Message envoyé !",
      es: "¡Mensaje enviado!"
    },
    error: {
      en: "Something went wrong, please try again later or contact me directly at vic.segen@gmail.com",
      fr: "Quelque chose s'est mal passé, veuillez réessayer plus tard ou contactez moi directement à vic.segen@gmail.com",
      es: "Algo salió mal, por favor inténtalo más tarde o contáctame directamente en vic.segen@gmail.com"
    }
  };

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
          setStateMessage(translations.success[language]);
          setIsSubmitting(false);
          setTimeout(() => {
            setStateMessage(null);
          }, 5000);
        },
        (error) => {
          setStateMessage(translations.error[language]);
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
        <label className="contact-form__label">
          {translations.name[language]}
        </label>
        <input 
          type="text" 
          name="user_name" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">
          {translations.email[language]}
        </label>
        <input 
          type="email" 
          name="user_email" 
          required 
          className="contact-form__input"
        />
      </div>
      
      <div className="contact-form__group">
        <label className="contact-form__label">
          {translations.message[language]}
        </label>
        <textarea 
          name="message" 
          required 
          className="contact-form__textarea"
        />
      </div>
      
      <div className="contact-form__group">
        <input 
          type="submit" 
          value={translations.send[language]}
          disabled={isSubmitting} 
          className="contact-form__submit"
        />
      </div>
      
      {stateMessage && (
        <p className={`contact-form__message ${
          stateMessage === translations.success[language] 
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
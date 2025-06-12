import { useState, useEffect } from 'react';
import emailjs from '@emailjs/browser';
import { useLanguage } from './context/LanguageContext';

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
      en: "Something went wrong, please try again later",
      fr: "Quelque chose s'est mal passé, veuillez réessayer plus tard",
      es: "Algo salió mal, por favor inténtalo más tarde"
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
    <form onSubmit={sendEmail} style={{ width: '100vw', padding: '20px', boxSizing: 'border-box' }}>
      <div style={{ width: '100%', marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          {translations.name[language]}
        </label>
        <input 
          type="text" 
          name="user_name" 
          required 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
        />
      </div>
      
      <div style={{ width: '100%', marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          {translations.email[language]}
        </label>
        <input 
          type="email" 
          name="user_email" 
          required 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box' }} 
        />
      </div>
      
      <div style={{ width: '100%', marginBottom: '15px' }}>
        <label style={{ display: 'block', marginBottom: '5px' }}>
          {translations.message[language]}
        </label>
        <textarea 
          name="message" 
          required 
          style={{ width: '100%', padding: '8px', boxSizing: 'border-box', minHeight: '100px' }} 
        />
      </div>
      
      <div style={{ width: '100%' }}>
        <input 
          type="submit" 
          value={translations.send[language]}
          disabled={isSubmitting} 
          style={{ width: '100%', padding: '10px', cursor: isSubmitting ? 'not-allowed' : 'pointer' }} 
        />
      </div>
      
      {stateMessage && <p style={{ textAlign: 'center', marginTop: '10px' }}>{stateMessage}</p>}
    </form>
  );
};

export default ContactForm;
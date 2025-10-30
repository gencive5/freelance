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
  const [isSquished, setIsSquished] = useState(false); // 👈 new state
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
          
          setMessageType('success');
          setIsSubmitting(false);
          setIsSquished(true); // 👈 squish after success

          setTimeout(() => {
            
            setMessageType(null);
            setIsSquished(false); // 👈 remove if you want permanent squish
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
    <form onSubmit={sendEmail} className="contact-form" noValidate>
      <div className="contact-form__group">
        <label htmlFor="user_name" className="contact-form__label">
          Nom:
        </label>
        <input
          id="user_name"
          ref={nameInputRef}
          type="text"
          name="user_name"
          required
          className="contact-form__input"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="name"
          aria-required="true"
          aria-describedby="name_description"
        />
        <span id="name_description" className="sr-only">Veuillez entrer votre nom complet</span>
      </div>

      <div className="contact-form__group">
        <label htmlFor="user_email" className="contact-form__label">
          Email:
        </label>
        <input
          id="user_email"
          ref={emailInputRef}
          type="email"
          name="email"
          required
          className="contact-form__input"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="email"
          aria-required="true"
          aria-describedby="email_description"
        />
        <span id="email_description" className="sr-only">Veuillez entrer une adresse email valide</span>
      </div>

      <div className="contact-form__group textarea-container">
        <label htmlFor="user_message" className="contact-form__label">
          Message:
        </label>
        <textarea
          id="user_message"
          ref={textareaRef}
          name="message"
          required
          className="contact-form__textarea"
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          aria-required="true"
          aria-describedby="message_description"
        />
        <span id="message_description" className="sr-only">Veuillez entrer votre message</span>
        <MetallicTextareaScrollbar
          textareaRef={textareaRef}
          style={{
            '--metal': 'silver',
            '--convexity': '1.5',
          }}
        />
      </div>

      <div className="contact-form__submit-container">
        <MetallicButton
          type="submit"
          disabled={isSubmitting}
          className={isSquished ? 'squished' : ''} // 👈 pass squished class
          style={{
            width: isMobile ? '8rem' : '12rem',
            height: isMobile ? '8rem' : '12rem',
           
          }}
          aria-label={isSubmitting ? "Envoi en cours..." : "Soumettre le formulaire de contact"}
        />

        {stateMessage && (
          <p 
            className={`contact-form__message contact-form__message--${messageType}`}
            role="alert"
            aria-live="polite"
          >
            {stateMessage}
          </p>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
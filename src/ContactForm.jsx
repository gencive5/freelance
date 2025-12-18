import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import './ContactForm.css';
import MetallicButton from './MetallicButton';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
  const [formData, setFormData] = useState({
    user_name: '',
    user_email: '',
    user_message: ''
  });
  const [fieldStatus, setFieldStatus] = useState({
    user_name: 'neutral',
    user_email: 'neutral',
    user_message: 'neutral'
  });
  const [emailError, setEmailError] = useState(false);
  
  const textareaRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);

  useEffect(() => {
    const handleResize = () => setIsMobile(window.innerWidth <= 768);
    window.addEventListener('resize', handleResize);

    // Anti-autocorrect measures
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

  const validateEmail = (email) => {
    const re = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return re.test(email);
  };

  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
    
    // Reset field status when user starts typing
    if (fieldStatus[name] !== 'neutral') {
      setFieldStatus(prev => ({
        ...prev,
        [name]: 'neutral'
      }));
    }
    
    // Validate email in real-time
    if (name === 'user_email') {
      if (value.trim() && !validateEmail(value)) {
        setEmailError(true);
      } else {
        setEmailError(false);
      }
    }
  };

  const isFormValid = () => {
    return formData.user_name.trim() !== '' && 
           formData.user_email.trim() !== '' && 
           validateEmail(formData.user_email) &&
           formData.user_message.trim() !== '';
  };

  const sendEmail = (e) => {
    e.preventDefault();
    
    // Reset all field statuses
    setFieldStatus({
      user_name: 'neutral',
      user_email: 'neutral',
      user_message: 'neutral'
    });
    
    const newFieldStatus = {};
    let formHasErrors = false;
    
    // Validate each field
    if (formData.user_name.trim() === '') {
      newFieldStatus.user_name = 'error';
      formHasErrors = true;
    }
    
    if (formData.user_email.trim() === '' || !validateEmail(formData.user_email)) {
      newFieldStatus.user_email = 'error';
      formHasErrors = true;
    }
    
    if (formData.user_message.trim() === '') {
      newFieldStatus.user_message = 'error';
      formHasErrors = true;
    }
    
    // If there are errors, show them and return
    if (formHasErrors) {
      setFieldStatus(prev => ({
        ...prev,
        ...newFieldStatus
      }));
      return;
    }
    
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
          // SUCCESS: Turn all inputs bright green
          setFieldStatus({
            user_name: 'success',
            user_email: 'success',
            user_message: 'success'
          });
          setIsSubmitting(false);
          setIsSquished(true);
          
          // Reset form data
          setFormData({
            user_name: '',
            user_email: '',
            user_message: ''
          });

          // Reset colors after 5 seconds
          setTimeout(() => {
            setFieldStatus({
              user_name: 'neutral',
              user_email: 'neutral',
              user_message: 'neutral'
            });
            setIsSquished(false);
          }, 5000);
        },
        (error) => {
          // ERROR: Turn all inputs red, keep text
          setFieldStatus({
            user_name: 'error',
            user_email: 'error',
            user_message: 'error'
          });
          setIsSubmitting(false);
          
          // Reset colors after 5 seconds
          setTimeout(() => {
            setFieldStatus({
              user_name: 'neutral',
              user_email: 'neutral',
              user_message: 'neutral'
            });
          }, 5000);
        }
      );
  };

  const getInputClassName = (fieldName) => {
    const status = fieldStatus[fieldName];
    return `contact-form__input contact-form__input--${status}`;
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
          value={formData.user_name}
          onChange={handleInputChange}
          required
          className={getInputClassName('user_name')}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="name"
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="user_email" className="contact-form__label">
          Email:
        </label>
        <input
          id="user_email"
          ref={emailInputRef}
          type="email"
          name="user_email"
          value={formData.user_email}
          onChange={handleInputChange}
          required
          className={getInputClassName('user_email')}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
          autoComplete="email"
        />
      </div>

      <div className="contact-form__group">
        <label htmlFor="user_message" className="contact-form__label">
          Message:
        </label>
        <textarea
          id="user_message"
          ref={textareaRef}
          name="user_message"
          value={formData.user_message}
          onChange={handleInputChange}
          required
          className={getInputClassName('user_message')}
          autoCorrect="off"
          autoCapitalize="off"
          spellCheck="false"
        />
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
          className={isSquished ? 'squished' : ''}
          style={{
            width: window.innerWidth <= 768 ? '8rem' : '12rem',
            height: window.innerWidth <= 768 ? '8rem' : '12rem',
          }}
          aria-label={isSubmitting ? "Envoi en cours..." : "Soumettre le formulaire de contact"}
        />
      </div>
    </form>
  );
};

export default ContactForm;
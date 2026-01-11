import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import './ContactForm.css';
import MetallicButton from './MetallicButton';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';
import MetallicSwitch from './MetallicSwitch';
import EmailIcon from './icons/EmailIcon'; 
import InstagramIcon from './icons/InstagramIcon';
import YoutubeIcon from './icons/YoutubeIcon';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);
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
  const [isSwitchOn, setIsSwitchOn] = useState(false);
  
  const textareaRef = useRef(null);
  const nameInputRef = useRef(null);
  const emailInputRef = useRef(null);
  const formRef = useRef(null);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };
    
    window.addEventListener('resize', handleResize);
    handleResize(); // Initial check

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

  const handleSwitchChange = (checked) => {
    // If form is invalid and user is trying to turn ON
    if (!isFormValid() && checked) {
      // Create a spring-back effect
      setIsSwitchOn(true); // Briefly show it moving
      
      // Show error feedback
      setFieldStatus(prev => {
        const newStatus = { ...prev };
        
        if (!formData.user_name.trim()) {
          newStatus.user_name = 'error';
        }
        if (!formData.user_email.trim() || !validateEmail(formData.user_email)) {
          newStatus.user_email = 'error';
        }
        if (!formData.user_message.trim()) {
          newStatus.user_message = 'error';
        }
        
        return newStatus;
      });
      
      // Spring back after a short delay (for visual feedback)
      setTimeout(() => {
        setIsSwitchOn(false);
      }, 200);
      
      // Reset error colors after 2 seconds
      setTimeout(() => {
        setFieldStatus({
          user_name: 'neutral',
          user_email: 'neutral',
          user_message: 'neutral'
        });
      }, 2000);
      
      return; // Don't proceed to submission
    }
    
    // Normal behavior when form is valid
    setIsSwitchOn(checked);
    
    // ON MOBILE ONLY: When user slides the switch to ON, automatically submit
    if (isMobile && checked) {
      handleSubmit();
    }
  };

  const isFormValid = () => {
    return formData.user_name.trim() !== '' && 
           formData.user_email.trim() !== '' && 
           validateEmail(formData.user_email) &&
           formData.user_message.trim() !== '';
  };

  const handleSubmit = (e) => {
    if (e) e.preventDefault();
    
    // Check if form is valid
    if (!isFormValid()) {
      // Highlight invalid fields
      const newFieldStatus = {};
      let hasErrors = false;
      
      if (formData.user_name.trim() === '') {
        newFieldStatus.user_name = 'error';
        hasErrors = true;
      }
      
      if (formData.user_email.trim() === '' || !validateEmail(formData.user_email)) {
        newFieldStatus.user_email = 'error';
        hasErrors = true;
      }
      
      if (formData.user_message.trim() === '') {
        newFieldStatus.user_message = 'error';
        hasErrors = true;
      }
      
      if (hasErrors) {
        setFieldStatus(prev => ({
          ...prev,
          ...newFieldStatus
        }));
      }
      return;
    }
    
    setIsSubmitting(true);

    // Create a form element for emailjs
    const formElement = formRef.current || document.createElement('form');
    
    emailjs
      .sendForm(
        import.meta.env.VITE_SERVICE_ID,
        import.meta.env.VITE_TEMPLATE_ID,
        formElement,
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
          
          // Reset form data
          setFormData({
            user_name: '',
            user_email: '',
            user_message: ''
          });
          
          // Turn switch OFF after successful send
          setIsSwitchOn(false);

          // Reset colors after 3 seconds
          setTimeout(() => {
            setFieldStatus({
              user_name: 'neutral',
              user_email: 'neutral',
              user_message: 'neutral'
            });
          }, 3000);
        },
        (error) => {
          // ERROR: Turn all inputs red, keep text
          setFieldStatus({
            user_name: 'error',
            user_email: 'error',
            user_message: 'error'
          });
          setIsSubmitting(false);
          setIsSwitchOn(false); // Turn switch OFF on error
          
          // Reset colors after 3 seconds
          setTimeout(() => {
            setFieldStatus({
              user_name: 'neutral',
              user_email: 'neutral',
              user_message: 'neutral'
            });
          }, 3000);
        }
      );
  };

  const getInputClassName = (fieldName) => {
    const status = fieldStatus[fieldName];
    return `contact-form__input contact-form__input--${status}`;
  };

  return (
    <form ref={formRef} onSubmit={!isMobile ? handleSubmit : (e) => e.preventDefault()} className="contact-form" noValidate>
      <div className="contact-form__group">

        {isMobile && (
          <span className="text-fit">
            <span>
              <span>Parlez moi de votre projet</span>
            </span>
            <span aria-hidden="true">Parlez moi de votre projet</span>
          </span>                     
        )}
        {!isMobile && (
          <span className="text-fit">
            <span>
              <span>Pour demander votre site ou me parler de vos idées et projets, vous pouvez remplir ce formulaire</span>
            </span>
            <span aria-hidden="true">Pour demander votre site ou me parler de vos idées et projets, vous pouvez remplir ce formulaire</span>
          </span>
        )}
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

      <div className="contact-form__submit-responsive">
        <div style={{ width: '100%' }}>
          {/* MOBILE: Slider switch */}
          {isMobile && (
            <div className="contact-form__mobile-submit">
              <MetallicSwitch
                checked={isSwitchOn}
                onChange={handleSwitchChange}
                size="xlg"
                className={`mobile-slider ${!isFormValid() ? 'disabled' : ''}`}
              />
            </div>
          )}
        </div>

        {/* DESKTOP: Round button without text */}
        {!isMobile && (
          <div className="contact-form__desktop-submit">
            <MetallicButton
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: '4rem',
                position: 'relative',
                cursor: 'pointer',
              }}
              aria-label={isSubmitting ? "Envoi en cours" : "Envoyer le message"}
            >
              {<span className="submit-label">envoyer</span>}
            </MetallicButton>
          </div>
        )}
      </div>
      
      <footer className="footer">
        <div className="footer-left">
          <a
            href="mailto:vic.segen@gmail.com"
            className="link contact-icon-link"
          >
            <EmailIcon/>
          </a>
          <a
            href="https://instagram.com/gencive5"
            target="_blank"
            rel="noopener noreferrer"
            className="link contact-icon-link"
            style={{marginLeft: '1rem' }}
          >
            <InstagramIcon/>
          </a>
          <a
            href="https://instagram.com/gencive5"
            target="_blank"
            rel="noopener noreferrer"
            className="link contact-icon-link"
            style={{marginLeft: '1rem' }}
          >
            <YoutubeIcon/>
          </a>
        </div>
        
        <div className="footer-right">
          <a
            href="https://sm00ch.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            style={{ color: '#02bebe' }}
          >
            SM00CH
          </a>
        </div>
      </footer>
    </form>
  );
};

export default ContactForm;
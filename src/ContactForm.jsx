import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './App.css';
import './ContactForm.css';
import MetallicButton from './MetallicButton';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';
import MetallicSwitch from './MetallicSwitch';

const ContactForm = () => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSquished, setIsSquished] = useState(false);
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
      if (formData.user_name.trim() === '') newFieldStatus.user_name = 'error';
      if (formData.user_email.trim() === '' || !validateEmail(formData.user_email)) newFieldStatus.user_email = 'error';
      if (formData.user_message.trim() === '') newFieldStatus.user_message = 'error';
      
      setFieldStatus(prev => ({
        ...prev,
        ...newFieldStatus
      }));
      return;
    }
    
    // On mobile, the switch is already ON if we're submitting
    // On desktop, trigger squish animation
    if (!isMobile) {
      setIsSquished(true);
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
          setIsSquished(true);
          
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
            setIsSquished(false);
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

      {/* RESPONSIVE SUBMIT SECTION */}
      <div className="contact-form__submit-responsive">
        <div className="submit-header">
          <span className="submit-label">Envoyer:</span>
        </div>
        
        {/* MOBILE: Slider switch */}
        {isMobile && (
          <div className="contact-form__mobile-submit">
            <MetallicSwitch
              checked={isSwitchOn}
              onChange={handleSwitchChange}
              size="xlg"
              disabled={isSubmitting || !isFormValid()}
              className={`mobile-slider ${!isFormValid() ? 'disabled' : ''}`}
            />
            {isSubmitting && (
              <div className="submitting-indicator">
                Envoi en cours...
              </div>
            )}
          </div>
        )}

        {/* DESKTOP: Round button without text */}
        {!isMobile && (
          <div className="contact-form__desktop-submit">
            <MetallicButton
              type="submit"
              disabled={isSubmitting || !isFormValid()}
              className={isSquished ? 'squished' : ''}
              style={{
                width: '100%',
                height: '4rem',
                position: 'relative',
              }}
              aria-label={isSubmitting ? "Envoi en cours" : "Envoyer le message"}
              onClick={() => {
                // Trigger squish immediately on click
                if (isFormValid() && !isSubmitting) {
                  setIsSquished(true);
                }
              }}
            >
              {/* Empty - no text inside the button */}
            </MetallicButton>
          </div>
        )}
      </div>
    </form>
  );
};

export default ContactForm;
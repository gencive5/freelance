import { useState, useEffect, useRef } from 'react';
import emailjs from '@emailjs/browser';
import './ContactForm.css';
import MetallicTextareaScrollbar from './MetallicTextareaScrollbar';
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

    
    emailjs.send(
      import.meta.env.VITE_SERVICE_ID,
      import.meta.env.VITE_TEMPLATE_ID,
      {
        name: formData.user_name,
        email: formData.user_email,
        message: formData.user_message,
        title: "Contact website"
      },
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
    <form ref={formRef} onSubmit={handleSubmit} className="contact-form" noValidate>

    <div className="contact-form__content">

      <div className="contact-form__group">
        {isMobile && (
          <span className="text-fit marginb">
            <span>
              <span>Parlez moi de votre projet</span>
            </span>
            <span aria-hidden="true">Parlez moi de votre projet</span>
          </span>                     
        )}
        {!isMobile && (
          <span className="text-fit marginb">
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

     <div className="contact-form__submit">
  <button
              type="submit"
              disabled={isSubmitting}
              style={{
                width: '100%',
                height: 'auto',
                position: 'relative',
                cursor: 'pointer',
                color: 'inherit', 
                backgroundColor: 'transparent',
                border: 'none', 
                padding: '0', 
              }}
              aria-label={isSubmitting ? "Envoi en cours" : "Envoyer le message"}
            >
          { <span className="text-fit submit-label">
            <span>
              <span>envoyer</span>
            </span>
            <span aria-hidden="true">envoyer</span>
          </span>   }
    </button>
</div>

      {isMobile && (
      
      <footer className="footer">
        <div className="footer-left">
          <a
            href="mailto:contact@genciv.es"
            className="link"
            aria-label="email"
          >
            <EmailIcon/>
          </a>
          <a
            href="https://instagram.com/gencive5"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            aria-label="instagram"
            style={{marginLeft: '2rem' }}
          >
            <InstagramIcon/>
          </a>
          <a
            href="https://www.youtube.com/@Gencives"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            aria-label="youtube"
            style={{marginLeft: '2rem' }}
          >
            <YoutubeIcon/>
          </a>
        </div>
        
        <div className="footer-right">
          <a
            href="https://sm00ch.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="visit sm00ch font"
            style={{ color: '#02bebe' }}
          >
            SM00CH
          </a>
        </div>
      </footer>
      )
      }

    </div>

    {!isMobile && (<footer className="footer">
        <div className="footer-left">
          <a
            href="mailto:contact@genciv.es"
            className="link"
            aria-label="email"
          >
            <EmailIcon/>
          </a>
          <a
            href="https://instagram.com/gencive5"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            aria-label="instagram"
            style={{marginLeft: '2rem' }}
          >
            <InstagramIcon/>
          </a>
          <a
            href="https://www.youtube.com/@Gencives"
            target="_blank"
            rel="noopener noreferrer"
            className="link"
            aria-label="youtube"
            style={{marginLeft: '2rem' }}
          >
            <YoutubeIcon/>
          </a>
        </div>
        
        <div className="footer-right">
          <a
            href="https://sm00ch.xyz/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="visit sm00ch font"
            style={{ color: '#02bebe' }}
          >
            SM00CH
          </a>
        </div>
      </footer>
      )}

    </form>
  );
};

export default ContactForm;
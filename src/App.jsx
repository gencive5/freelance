// src/App.jsx
import './App.css';
import TextFit from './TextFit';
import ContactForm from './ContactForm';
import LanguageSwitcher from './components/LanguageSwitcher'; 
import { useLanguage } from './context/LanguageContext';
import { LanguageProvider } from './context/LanguageContext';
import DistortedText from './DistortedText';

const AppContent = () => {
  const { language } = useLanguage();

  const translations = {
    askForWebsite: {
      en: "ASK FOR YOUR WEBSITE NOW",
      fr: "DEMANDEZ VOTRE SITE WEB MAINTENANT",
      es: "SOLICITA TU SITIO WEB AHORA"
    },
    leaveContact: {
      en: "Leave your contact details below and I will get back to you today",
      fr: "Laissez vos coordonnées ci-dessous et je vous répondrai aujourd'hui",
      es: "Deja tus datos de contacto abajo y me pondré en contacto contigo hoy"
    },
    orContact: {
      en: "or contact me at vic.segen@gmail.com",
      fr: "ou contactez-moi à vic.segen@gmail.com",
      es: "o contáctame en vic.segen@gmail.com"
    }
  };

  return (
    <div className="container">
      <LanguageSwitcher />
      <TextFit />
      
      <div style={{ padding: '20px' }} className="Figure-Demo">
        <span className="text-fit">
          <span><span>{translations.askForWebsite[language]}</span></span>
          <span aria-hidden="true">{translations.askForWebsite[language]}</span>
        </span>
      </div>
      
      <div className="Figure-Demo">
        <span className="text-fit">
          <span><span>{translations.leaveContact[language]}</span></span>
          <span aria-hidden="true">{translations.leaveContact[language]}</span>
        </span>
      </div>

      <ContactForm />
      
      <div className="Figure-Demo">
        <span className="text-fit">
          <span><span>{translations.orContact[language]}</span></span>
          <span aria-hidden="true">{translations.orContact[language]}</span>
        </span>
      </div>
    
    <DistortedText 
  text="YOUR TEXT HERE" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile
  color="#FF0A54"
  speed={0.3}
/>
    </div>
    
  );
};

const App = () => {
  return (
    <LanguageProvider>
      <AppContent />
    </LanguageProvider>
  );
};

export default App;
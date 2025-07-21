// src/App.jsx
import './App.css';
import ContactForm from './ContactForm';
// import LanguageSwitcher from './components/LanguageSwitcher'; 
import { useLanguage } from './context/LanguageContext';
import { LanguageProvider } from './context/LanguageContext';
import DistortedText from './DistortedText';
// import Distorted from './Distorted';

const AppContent = () => {
  const { language } = useLanguage();

  const translations = {
    askForWebsite: {
      en: "ASK FOR YOUR WEBSITE NOW",
      fr: "DEMANDEZ VOTRE SITE WEB MAINTENANT",
      es: "SOLICITA TU SITIO WEB AHORA"
    },
    leaveContact: {
      en: "Leave your contact details and I will get back to you today",
      fr: "Laissez vos coordonnées et je vous répondrai aujourd'hui",
      es: "Deja tus datos de contacto y me pondré en contacto contigo hoy"
    }
  };

  return (
    <div className="container">
      
      

 <div className="title-wrapper">
 <DistortedText 
  text="Gencives" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
<DistortedText 
  text="développeur" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
<DistortedText 
  text="créatif" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
</div>

<DistortedText 
  text="DEMANDEZ VOTRE SITE WEB MAINTENANT" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile

  
/>


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
      
    
    <DistortedText 
  text="TEST TEST!" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile

  
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
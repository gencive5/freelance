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

  
  return (
    <div className="container">
      
      

 <div className="title-wrapper">
 <DistortedText 
  text="Gencives" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
<DistortedText 
  text="développeur créatif" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
<DistortedText 
  text="créatif" 
  size={window.innerWidth > 768 ? 60 : 40} // Larger on desktop, smaller on mobile  
/>
</div>



      <div style={{ padding: '20px' }} className="Figure-Demo">
        <span className="text-fit">
          <span><span>DEMANDEZ VOTRE SITE WEB MAINTENANT</span></span>
          <span aria-hidden="true">DEMANDEZ VOTRE SITE WEB MAINTENANT</span>
        </span>
      </div>
      
      <div className="Figure-Demo">
        <span className="text-fit">
          <span><span>Laissez vos coordonnées et je vous répondrai aujourd'hui</span></span>
          <span aria-hidden="true">Laissez vos coordonnées et je vous répondrai aujourd'hui</span>
        </span>
      </div>

      <ContactForm />
      

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
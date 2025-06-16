// src/TextFit.jsx
import './App.css';
import { useLanguage } from './context/LanguageContext';

const TextFit = () => {
  const { language } = useLanguage();

  const texts = {
    title: {
      en: "GENCiVES",
      fr: "GENCiVES",
      es: "GENCiVES"
    },
    subtitle: {
      en: "creative developer",
      fr: "développeur créatif",
      es: "desarrollador creativo"
    },
    location: {
      en: "based in Paris & available internationally",
      fr: "basé à Paris & disponible à l'international",
      es: "basado en París & disponible internacionalmente"
    },
    deliver: {
      en: "I DELiVER HiGH CONCEPT WEBSiTES",
      fr: "JE LIVRE DES SITES WEB HAUT CONCEPT",
      es: "CREO SITIOS WEB DE ALTO CONCEPTO"
    },
  };

  return (
    <div className="Figure-Demo">
      <span className="text-fit">
        <span><span>{texts.title[language]}</span></span>
        <span aria-hidden="true">{texts.title[language]}</span>
      </span>
      
      <span className="text-fit">
        <span><span>{texts.subtitle[language]}</span></span>
        <span aria-hidden="true">{texts.subtitle[language]}</span>
      </span>
      
      <em className="text-fit">
        <span><span>{texts.location[language]}</span></span>
        <span aria-hidden="true">{texts.location[language]}</span>
      </em>

      <em className="text-fit">
        <span><span>{texts.deliver[language]}</span></span>
        <span aria-hidden="true">{texts.deliver[language]}</span>
      </em>

    </div>
  );
};

export default TextFit;
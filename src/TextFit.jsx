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
    services: {
      en: "SERVICES: DESIGN - UX/UI - BRAND IDENTITY - FRONT-END DEVELOPMENT",
      fr: "SERVICES: DESIGN - UX/UI - IDENTITÉ DE MARQUE - DÉVELOPPEMENT FRONT-END",
      es: "SERVICIOS: DISEÑO - UX/UI - IDENTIDAD DE MARCA - DESARROLLO FRONT-END"
    },
    location: {
      en: "based in Paris & available internationally",
      fr: "basé à Paris & disponible à l'international",
      es: "con sede en París & disponible internacionalmente"
    },
    deliver: {
      en: "I DELiVER HiGH CONCEPT WEBSiTES",
      fr: "JE LIVRE DES SITES WEB HAUT DE GAMME",
      es: "CREO SITIOS WEB DE ALTO CONCEPTO"
    },
    timeline1: {
      en: "For one landing page, count between 2 and 4 weeks of production.",
      fr: "Pour une page d'accueil, comptez entre 2 et 4 semaines de production.",
      es: "Para una página de destino, calcula entre 2 y 4 semanas de producción."
    },
    timeline2: {
      en: "A more elaborate website will take between 6 and 8 weeks.",
      fr: "Un site web plus élaboré prendra entre 6 et 8 semaines.",
      es: "Un sitio web más elaborado tomará entre 6 y 8 semanas."
    }
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
        <span><span>{texts.services[language]}</span></span>
        <span aria-hidden="true">{texts.services[language]}</span>
      </em>
      
      <em className="text-fit">
        <span><span>{texts.location[language]}</span></span>
        <span aria-hidden="true">{texts.location[language]}</span>
      </em>

      <em className="text-fit">
        <span><span>{texts.deliver[language]}</span></span>
        <span aria-hidden="true">{texts.deliver[language]}</span>
      </em>

      <em className="text-fit">
        <span><span>{texts.timeline1[language]}</span></span>
        <span aria-hidden="true">{texts.timeline1[language]}</span>
      </em>

      <em className="text-fit">
        <span><span>{texts.timeline2[language]}</span></span>
        <span aria-hidden="true">{texts.timeline2[language]}</span>
      </em>
    </div>
  );
};

export default TextFit;
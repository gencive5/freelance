import BlotterText from './BlotterText';
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
    <div className="textfit-container">
      <BlotterText text={texts.title[language]} initialSize={100} />
<BlotterText text={texts.subtitle[language]} initialSize={60} />
<BlotterText text={texts.location[language]} initialSize={50} />
<BlotterText text={texts.deliver[language]} initialSize={20} />
    </div>
  );
};

export default TextFit;

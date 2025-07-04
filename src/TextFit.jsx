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
  };

  return (
    <div className="textfit-container">
     <BlotterText text={texts.title[language]} />
<BlotterText text={texts.subtitle[language]} />
    </div>
  );
};

export default TextFit;

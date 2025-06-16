// src/components/LanguageSwitcher.jsx
import { useLanguage } from '../context/LanguageContext';

const LanguageSwitcher = () => {
  const { language, setLanguage } = useLanguage();

  return (
    <div style={{
      position: 'static',
      top: '2rem',
      right: '2rem',
      display: 'flex',
      gap: '8px',
      zIndex: 1000
    }}>
      {['en', 'fr', 'es'].map((lang) => (
        <button
          key={lang}
          onClick={() => setLanguage(lang)}
          style={{
            padding: '8px 16px',
            background: language === lang ? 'black' : 'white',
            color: language === lang ? 'white' : 'black',
            border: '1px solid black',
            cursor: 'pointer',
            textTransform: 'uppercase'
          }}
        >
          {lang}
        </button>
      ))}
    </div>
  );
};

export default LanguageSwitcher;
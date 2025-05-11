import { motion } from 'framer-motion';
import { useState } from 'react';

const VasarelyRippleText = ({ text }: { text: string }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  const getRippleEffect = (i: number) => {
    if (hoverIndex === null) return {};
    
    const distance = Math.abs(i - hoverIndex);
    const strength = Math.max(0, 1 - Math.pow(distance * 0.2, 2));
    
    return {
      scale: 1 + strength * 0.8,
      rotate: strength * (Math.random() * 30 - 15),
      y: -8 * strength,
      x: (Math.random() * 10 - 5) * strength,
      textShadow: strength > 0.5 ? 
        `0 0 ${strength * 8}px rgba(240, 248, 181, ${strength * 0.7})` : 'none',
      zIndex: Math.floor(strength * 10),
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1]
      }
    };
  };

  return (
    <motion.div 
      className="text-line"
      style={{
        display: 'flex',
        flexWrap: 'wrap',
        perspective: '2000px',
        fontFamily: '"Helvetica Neue", sans-serif',
        lineHeight: '1.6',
        padding: '20px',
        backgroundColor: '#242424',
        borderRadius: '8px',
        color: '#f0f8b5',
        willChange: 'contents'
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ 
            display: 'inline-block',
            transformOrigin: 'center bottom',
            whiteSpace: 'pre',
            willChange: 'transform',
            backfaceVisibility: 'hidden',
            WebkitFontSmoothing: 'subpixel-antialiased',
            fontSize: 'clamp(1rem, 1.5vw, 1.5rem)'
          }}
          onMouseEnter={() => setHoverIndex(i)}
          onMouseLeave={() => setHoverIndex(null)}
          animate={getRippleEffect(i)}
        >
          {char === ' ' ? '\u00A0' : char}
        </motion.span>
      ))}
    </motion.div>
  );
};

export default function InteractiveText() {
  const portfolioText = [
    "Gencives - développeur créatif",
    "Designer et développeur front-end basé à Paris.",
    "SERVICES: DESIGN - IDENTITÉ DE MARQUE - CONCEPT",
    "DÉVELOPPEMENT WEB RESPONSIVE - UX/UI",
    "TYPOGRAPHIE - DÉVELOPPEMENT CRÉATIF",
    "disponible internationalement heure locale: 13:00",
    "TECHNIQUES: React, Next.js, Node, Java, HTML/CSS",
    "CONTACTEZ MOI vic.segen@gmail.com"
  ];

  return (
    <div className="text-container">
      {portfolioText.map((line, index) => (
        <VasarelyRippleText key={index} text={line} />
      ))}
    </div>
  );
}
import { motion } from 'framer-motion';
import { useState } from 'react';

const VasarelyRippleText = ({ text }: { text: string }) => {
  const [hoverIndex, setHoverIndex] = useState<number | null>(null);

  // Enhanced ripple effect with quadratic falloff
  const getRippleEffect = (i: number) => {
    if (hoverIndex === null) return {};
    
    const distance = Math.abs(i - hoverIndex);
    // Quadratic falloff for smoother gradient (Vasarely style)
    const strength = Math.max(0, 1 - Math.pow(distance * 0.2, 2));
    
    return {
      scale: 1 + strength * 0.8, // Stronger scaling (1.8x max)
      rotate: strength * (Math.random() * 30 - 15), // Wider angle range
      y: -8 * strength, // Bigger vertical movement
      x: (Math.random() * 10 - 5) * strength, // Increased horizontal range
      textShadow: strength > 0.5 ? 
        `0 0 ${strength * 8}px rgba(240, 248, 181, ${strength * 0.7})` : 'none',
      zIndex: Math.floor(strength * 10),
      transition: {
        duration: 0.5,
        ease: [0.33, 1, 0.68, 1] // More elastic easing
      }
    };
  };

  return (
    <motion.div 
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        perspective: '1000px',
        fontFamily: '"Helvetica Neue", sans-serif',
        fontSize: 'clamp(1rem, 3vw, 2rem)',
        lineHeight: '1.6',
        padding: '20px',
        backgroundColor: '#242424',
        borderRadius: '8px',
        color: '#f0f8b5',
        willChange: 'contents' // Optimizes rendering
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ 
            display: 'inline-block',
            transformOrigin: 'center bottom',
            whiteSpace: 'pre',
            willChange: 'transform', // Only transform will change
            backfaceVisibility: 'hidden', // Prevents blurriness
            WebkitFontSmoothing: 'subpixel-antialiased' // Crisp text
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
    "- DEVELOPPEMENT WEB RESPONSIVE -",
    "TYPOGRAPHIE - DÉVELOPPEMENT CRÉATIF",
    "disponible internationalement heure locale: 13:00",
    "TECHNIQUES: React, Next.js, Node, Java, HTML/CSS",
    "CONTACTEZ MOI vic.segen@gmail.com"
  ];

  return (
    <div style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem',
      backgroundColor: '#121212'
    }}>
      {portfolioText.map((line, index) => (
        <VasarelyRippleText key={index} text={line} />
      ))}
    </div>
  );
}
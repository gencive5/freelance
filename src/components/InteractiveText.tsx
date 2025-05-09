import { motion } from 'framer-motion';
import { useState } from 'react';

const LiquidDistortionText = ({ text }: { text: string }) => {
  const [activeIndex, setActiveIndex] = useState<number | null>(null);

  // Liquid distortion effect parameters
  const getDistortion = (i: number) => ({
    scale: [1, 1.4, 1.2],
    rotate: [
      0, 
      Math.random() * 15 - 7.5, 
      Math.random() * 10 - 5, 
      0
    ],
    y: [0, -10, 0],
    x: [0, Math.random() * 6 - 3, 0],
    skewX: [0, Math.random() * 10 - 5, 0],
    skewY: [0, Math.random() * 10 - 5, 0],
    filter: [
      'blur(0px)',
      `blur(${Math.random() * 1.5}px)`,
      'blur(0px)'
    ],
    transition: {
      duration: 0.8,
      ease: [0.2, 0.8, 0.4, 1]
    }
  });

  return (
    <motion.div 
      style={{
        display: 'inline-flex',
        flexWrap: 'wrap',
        perspective: '1000px',
        fontFamily: 'sans-serif',
        fontSize: 'clamp(1rem, 3vw, 2rem)',
        lineHeight: '1.6',
        padding: '20px',
        backgroundColor: '#f0f8b5',
        borderRadius: '8px'
      }}
    >
      {text.split('').map((char, i) => (
        <motion.span
          key={i}
          style={{ 
            display: 'inline-block',
            transformOrigin: 'center bottom',
            whiteSpace: 'pre' // Preserves spaces
          }}
          whileHover={getDistortion(i)}
          onHoverStart={() => setActiveIndex(i)}
          onHoverEnd={() => setActiveIndex(null)}
          animate={activeIndex === i ? getDistortion(i) : {}}
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
    "- DEVELOPPEMENT WEB RENNES -",
    "TYPOGRAPHIE - DÉVELOPPEMENT CRÉATIF",
    "disponible internationalement heure locale: 13:00",
    "TECHNIQUES: React, Next.js, Node, Java, HTML/CSS",
    "CONTACTEZ MOI vic.seqen@gmail.com"
  ];

  return (
    <div style={{ 
      maxWidth: '800px',
      margin: '0 auto',
      padding: '2rem',
      display: 'flex',
      flexDirection: 'column',
      gap: '1.5rem'
    }}>
      {portfolioText.map((line, index) => (
        <LiquidDistortionText key={index} text={line} />
      ))}
    </div>
  );
}
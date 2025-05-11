

const TextLine = ({ text }: { text: string }) => {
  return (
    <div className="text-line">
      {text}
    </div>
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
        <TextLine key={index} text={line} />
      ))}
    </div>
  );
}
import { motion } from 'framer-motion';

export default function InteractiveText() {
  return (
    <motion.div 
      whileHover={{ scale: 1.1 }}
      whileTap={{ scale: 0.9 }}
      style={{
        padding: '20px',
        backgroundColor: '#f0f0f5',
        borderRadius: '8px',
        display: 'inline-block'
      }}
    >
      Test - hover or tap me!
    </motion.div>
  );
}
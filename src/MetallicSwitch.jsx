import { useEffect, useState, useId } from 'react';
import 'metallicss';
import './MetallicSwitch.css';

const MetallicSwitch = ({ 
  checked = false,
  onChange,
  size = 'xlg', // 'sm', 'm', 'lg', 'xlg'
  disabled = false,
  className = '',
  label = 'glissez pour envoyer', // NEW PROP
  ...props 
}) => {
  const [isChecked, setIsChecked] = useState(checked);
  const id = useId();

  useEffect(() => {
    // Dynamically load the MetalliCSS script
    const script = document.createElement('script');
    script.src = 'https://unpkg.com/metallicss@4.0.3/dist/metallicss.min.js';
    script.type = 'module';
    document.body.appendChild(script);

    return () => {
      document.body.removeChild(script);
    };
  }, []);

  useEffect(() => {
    setIsChecked(checked);
  }, [checked]);

  const handleChange = (e) => {
    const newValue = e.target.checked;
    setIsChecked(newValue);
    if (onChange) {
      onChange(newValue);
    }
  };

  const sizeClass = `metalli-${size}`;
  const bgColor = 'rgb(128, 128, 128)';

  return (
    <span className={`metallic-switch-container ${className}`}>
      <input
        type="checkbox"
        id={`metallic-switch-${id}`}
        className="metalli-switch"
        checked={isChecked}
        onChange={handleChange}
        disabled={disabled}
        aria-checked={isChecked}
        {...props}
      />
      <label 
        htmlFor={`metallic-switch-${id}`}
        className={`${sizeClass} ${disabled ? 'disabled' : ''}`}
        style={{ cursor: disabled ? 'not-allowed' : 'pointer' }}
      >
        <span
          className="bg metallicss"
          style={{
            backgroundColor: bgColor,
            '--metal': 'silver',
          }}
        ></span>
        <span
          className="off metallicss"
          style={{
            backgroundColor: bgColor,
            '--metal': 'silver',
            opacity: disabled ? 0.6 : 1,
          }}
        ></span>
        <span
          className="on metallicss"
          style={{
            backgroundColor: bgColor,
            '--metal': 'silver',
            opacity: disabled ? 0.6 : 1,
          }}
        ></span>
        {/* ADD THIS TEXT SPAN */}
        <span className="switch-label-text">
          {label}
        </span>
      </label>
    </span>
  );
};

export default MetallicSwitch;
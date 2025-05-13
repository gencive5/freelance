import './App.css';
import CircleGrid from './CircleGrid';
import TextFit from './TextFit';
import ContactForm from './ContactForm';

const App = () => {
  return (
    <div className="container">
      <CircleGrid />
      <TextFit />
      <div style={{ backgroundColor: 'red', padding: '20px' }}>TEST DIV</div>
      <ContactForm />
    </div>
  );
};

export default App;
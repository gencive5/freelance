import './App.css';
import CircleGrid from './CircleGrid';
import TextFit from './TextFit';
import ContactForm from './ContactForm';

const App = () => {
  return (
    <div className="container">
      <CircleGrid />
      <TextFit />
      <div style={{ backgroundColor: 'red', padding: '20px' }}>ASK FOR YOUR WEBSITE NOW</div>
      <p>Leave your contact details below and I will get back to you today</p>
      <ContactForm />
      <p>or contact me at vic.segen@gmail.com</p>
    </div>
  );
};

export default App;
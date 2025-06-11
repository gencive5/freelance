import './App.css';
import CircleGrid from './CircleGrid';
import TextFit from './TextFit';
import ContactForm from './ContactForm';

const App = () => {
  return (
    <div className="container">
      <CircleGrid />
      <TextFit />
      <div style={{ backgroundColor: 'red', padding: '20px' }} className="Figure-Demo">
      <span className="text-fit">
        <span><span>ASK FOR YOUR WEBSITE NOW</span></span>
        <span aria-hidden="true">ASK FOR YOUR WEBSITE NOW</span>
      </span>
      </div>
       <div className="Figure-Demo">
      <span className="text-fit">
        <span><span>Leave your contact details below and I will get back to you today</span></span>
        <span aria-hidden="true">Leave your contact details below and I will get back to you today</span>
      </span>
      </div>
      <ContactForm />
      <div className="Figure-Demo">
      <span className="text-fit">
        <span><span>or contact me at vic.segen@gmail.com</span></span>
        <span aria-hidden="true">or contact me at vic.segen@gmail.com</span>
      </span>
      </div>
    </div>
  );
};

export default App;
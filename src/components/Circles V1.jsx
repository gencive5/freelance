import './App.css';

const Circles = () => {
  return (
    <div className="circle-grid">
      {/* Row 1 */}
      <div className="circle-row">
        <div className="circle" id="c1"></div>
        <div className="circle" id="c2"></div>
        <div className="circle" id="c3"></div>
        <div className="circle" id="c4"></div>
        <div className="circle" id="c5"></div>
        <div className="circle" id="c6"></div>
        <div className="circle" id="c7"></div>
        <div className="circle" id="c8"></div>
      </div>
      
      {/* Row 2 */}
      <div className="circle-row">
        <div className="circle" id="c9"></div>
        <div className="circle" id="c10"></div>
        <div className="circle" id="c11"></div>
        <div className="circle" id="c12"></div>
        <div className="circle" id="c13"></div>
        <div className="circle" id="c14"></div>
        <div className="circle" id="c15"></div>
        <div className="circle" id="c16"></div>
      </div>
      
      {/* Add more rows as needed */}
    </div>
  );
};

export default Circles;
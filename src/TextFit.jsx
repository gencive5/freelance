import './App.css';

const TextFit = () => {
  return (
    <div className="Figure-Demo">
      <span className="text-fit">
        <span><span>GENCiVES</span></span>
        <span aria-hidden="true">GENCiVES</span>
      </span>
      
      <span className="text-fit">
        <span><span>creative developer</span></span>
        <span aria-hidden="true">creative developer</span>
      </span>


      <em className="text-fit">
        <span><span>SERVICES: DESIGN - UX/UI - BRAND IDENTITY - FRONT-END DEVELOPMENT</span></span>
        <span aria-hidden="true">SERVICES: DESIGN - UX/UI - BRAND IDENTITY - FRONT-END DEVELOPMENT</span>
      </em>
      

      <em className="text-fit">
        <span><span>based in Paris & available internationally</span></span>
        <span aria-hidden="true">based in Paris & available internationally</span>
      </em>

        <em className="text-fit">
        <span><span>I DELiVER HiGH CONCEPT WEBSiTES</span></span>
        <span aria-hidden="true">I DELiVER HiGH CONCEPT WEBSiTES</span>
      </em>

      <em className="text-fit">
        <span><span>For one landing page, count between 2 and 4 weeks of production.</span></span>
        <span aria-hidden="true">For one landing page, count between 2 and 4 weeks of production.</span>
      </em>

      <em className="text-fit">
        <span><span>A more elaborate website will take between 6 and 8 weeks.</span></span>
        <span aria-hidden="true">A more elaborate website will take between 6 and 8 weeks.</span>
      </em>
    </div>
  );
};

export default TextFit;
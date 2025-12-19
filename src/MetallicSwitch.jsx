
import { useEffect } from 'react';
import 'metallicss';
import './MetallicSwitch.css'; 

const MetallicButton = ({ children, onClick, className = '', style = {}, ...props }) => {
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

  return (

<span>
  <input type="checkbox" id="switch_t2vkl" class="metalli-switch" />
  <label class="metalli-xlg" for="switch_t2vkl">
    <span
      class="bg metallicss"
      style="background-color: rgb(128, 128, 128); --metal: gold;"
    ></span>
    <span
      class="off metallicss"
      style="background-color: rgb(128, 128, 128); --metal: gold;"
    ></span>
    <span
      class="on metallicss"
      style="background-color: rgb(128, 128, 128); --metal: gold;"
    ></span>
  </label>
</span>
<span>
  <input type="checkbox" id="switch_wy0cq" class="metalli-switch" />
  <label class="metalli-xlg" for="switch_wy0cq">
    <span
      class="bg metallicss"
      style="background-color: rgb(128, 128, 128); --metal: silver;"
    ></span>
    <span
      class="off metallicss"
      style="background-color: rgb(128, 128, 128); --metal: silver;"
    ></span>
    <span
      class="on metallicss"
      style="background-color: rgb(128, 128, 128); --metal: silver;"
    ></span>
  </label>
</span>


 );
};


export default MetallicSwitch;
import Blotter from 'blotter';

const LiquidDistortMaterial = function () {
  Blotter.Material.call(this);

  this.uniforms = {
    uSpeed: { type: "1f", value: 1.0 },
    uVolatility: { type: "1f", value: 0.33 },
    uSeed: { type: "1f", value: 0.1 },
    uTime: { type: "1f", value: 0.0 }
  };

  this.vertexShader = `
    precision mediump float;
    attribute vec2 aVertexPosition;
    attribute vec2 aTextureCoord;

    uniform mat4 uProjectionMatrix;

    varying vec2 vTextureCoord;

    void main(void) {
      gl_Position = uProjectionMatrix * vec4(aVertexPosition, 0.0, 1.0);
      vTextureCoord = aTextureCoord;
    }
  `;

  this.fragmentShader = `
    precision mediump float;

    uniform float uSpeed;
    uniform float uVolatility;
    uniform float uSeed;
    uniform float uTime;

    uniform sampler2D tDiffuse;

    varying vec2 vTextureCoord;

    float random(vec2 co){
      return fract(sin(dot(co.xy ,vec2(12.9898,78.233))) * 43758.5453);
    }

    void main() {
      vec2 uv = vTextureCoord;
      float time = uTime * uSpeed;
      float wave = sin(uv.y * 10.0 + time) * uVolatility;
      uv.x += wave * uSeed;

      gl_FragColor = texture2D(tDiffuse, uv);
    }
  `;
};

LiquidDistortMaterial.prototype = Object.create(Blotter.Material.prototype);

export default LiquidDistortMaterial;

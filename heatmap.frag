precision mediump float;

// our texture
uniform sampler2D u_image;
uniform float u_weight;

// the texCoords passed in from the vertex shader.
varying vec2 v_texCoord;

void main() {
   vec4 color = texture2D(u_image, v_texCoord).bgra;
   color.a = color.a * u_weight;

   gl_FragColor = color;
}
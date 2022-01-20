// an attribute will receive data from a buffer
attribute vec4 a_position;

  // all shaders have a main function
void main() {

  // gl_Position is a special variable a vertex shader
  // is responsible for setting
  gl_Position = a_position;
}

// attribute vec2 a_texCoord;
// varying vec2 v_texCoord;

// void main() {
//    // 将纹理坐标传给片断着色器
//    // GPU会在点之间进行插值
//   v_texCoord = a_texCoord;
// }
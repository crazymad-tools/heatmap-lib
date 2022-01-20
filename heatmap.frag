// fragment shaders don't have a default precision so we need
// to pick one. mediump is a good default
precision mediump float;

void main() {
    // gl_FragColor is a special variable a fragment shader
    // is responsible for setting
  gl_FragColor = vec4(1, 0, 0.5, 1); // return redish-purple
}

// precision mediump float;

// // 纹理
// uniform sampler2D u_image;

// // 从顶点着色器传入的纹理坐标
// varying vec2 v_texCoord;

// void main() {
//    // 在纹理上寻找对应颜色值
//   gl_FragColor = texture2D(u_image, v_texCoord);
// }
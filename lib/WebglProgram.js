class WebglProgram {
  constructor(gl) {
    this.gl = gl;

    this.attr_locations = {};
    this.buffers = {}
  }

  createShader(type, source) {
    const shader = this.gl.createShader(type); // 创建着色器对象
    this.gl.shaderSource(shader, source); // 提供数据源
    this.gl.compileShader(shader); // 编译 -> 生成着色器
    const success = this.gl.getShaderParameter(shader, this.gl.COMPILE_STATUS);
    if (success) {
      return shader;
    }

    this.gl.deleteShader(shader);
    throw Error(this.gl.getShaderInfoLog(shader));
  }

  createProgram(vertex_source, fragment_source) {
    const gl = this.gl;

    const vertex_shader = this.createShader(gl.VERTEX_SHADER, vertex_source);
    const fragment_shader = this.createShader(
      gl.FRAGMENT_SHADER,
      fragment_source
    );

    const program = gl.createProgram();
    gl.attachShader(program, vertex_shader);
    gl.attachShader(program, fragment_shader);
    gl.linkProgram(program);
    const success = gl.getProgramParameter(program, gl.LINK_STATUS);

    if (success) {
      this.program = program;
      return;
    }

    gl.deleteProgram(program);
    throw new Error(gl.getProgramInfoLog(program));
  }

  bindBufferData(name, data) {
    const gl = this.gl;
    const program = this.program;
    const attribute_location = gl.getAttribLocation(program, name);
    const buffer = gl.createBuffer();

    gl.bindBuffer(gl.ARRAY_BUFFER, buffer);
    gl.bufferData(gl.ARRAY_BUFFER, data, gl.STATIC_DRAW);

    this.attr_locations[name] = attribute_location;
    this.buffers[name] = buffer;
  }

  enableVertextAttrib(name, options) {
    const gl = this.gl;

    gl.enableVertexAttribArray(this.attr_locations[name]);
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffers[name]);

    gl.vertexAttribPointer(
      this.attr_locations[name],
      options.size,
      options.type,
      options.normalize,
      options.stride,
      options.offset
    );
  }

  render() {}
}

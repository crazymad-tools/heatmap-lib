function isDefined(val) {
  return val !== undefined && val !== null && val !== NaN;
}

class WebglProgram {
  constructor(gl) {
    this.gl = gl;
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

class WebglBasic {
  constructor(canvas) {
    this.canvas = canvas;

    this.gl = this.canvas.getContext("webgl");
    this.attr_locations = {};
    this.uniform_locations = {};
    this.buffers = {};
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

  getUniformLocations(names) {
    const gl = this.gl;
    const program = this.program;

    for (const name of names) {
      this.uniform_locations[name] = gl.getUniformLocation(program, name);
    }
  }

  render() {
    const gl = this.gl;
    const program = this.program;

    const positions = new Float32Array([
      // 10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30,
      10, 20, 80, 20, 10, 30, 10, 30, 80, 20, 80, 30,
    ]);
    this.bindBufferData("a_position", positions);

    this.getUniformLocations(["u_resolution", "u_color"]);

    gl.useProgram(program);

    this.enableVertextAttrib("a_position", {
      size: 2, // 每次迭代运行提取两个单位数据
      type: gl.FLOAT, // 每个单位的数据类型是32位浮点型
      normalize: false, // 不需要归一化数据
      stride: 0, // 0 = 移动单位数量 * 每个单位占用内存（sizeof(type)）, 每次迭代运行运动多少内存到下一个数据开始点
      offset: 0, // 从缓冲起始位置开始读取
    });

    gl.uniform2f(
      this.uniform_locations["u_resolution"],
      gl.canvas.width,
      gl.canvas.height
    );
    gl.uniform4f(this.uniform_locations["u_color"], 1.0, 1.0, 0.0, 1.0);

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);

    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);
  }
}

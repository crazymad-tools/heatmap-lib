function isDefined(val) {
  return val !== undefined && val !== null && val !== NaN;
}

class ShadowProgram extends WebglProgram {
  constructor(gl) {
    super(gl);

    this.drawCircle();
    this.drawGradient();
  }

  drawCircle() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 60;
    canvas.height = 60;

    // context.fillStyle = "black";
    context.clearRect(0, 0, 60, 60);

    context.shadowOffsetX = context.shadowOffsetY = 60;
    context.shadowBlur = 15;
    context.shadowColor = "black";

    context.beginPath();
    context.arc(-30, -30, 15, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    // this.circle = canvas;
    this.circle = new Image();
    this.circle.src = canvas.toDataURL();
  }

  drawGradient() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");
    canvas.width = 256;
    canvas.height = 1;

    const color = context.createLinearGradient(0, 0, 255, 0);
    color.addColorStop(0, "blue");
    color.addColorStop(0.3, "green");
    color.addColorStop(0.6, "yellow");
    color.addColorStop(1, "red");

    context.fillStyle = color;
    context.fillRect(0, 0, 256, 1);

    this.gradient = canvas;
  }

  createRect(x1, y1) {
    const x2 = x1 + 100;
    const y2 = y1 + 100;

    return new Float32Array([x1, y1, x2, y1, x1, y2, x1, y2, x2, y1, x2, y2]);
  }

  createAndSetupTexture() {
    const gl = this.gl;
    const texture = gl.createTexture();
    gl.bindTexture(gl.TEXTURE_2D, texture);

    // 设置材质，这样我们可以对任意大小的图像进行像素操作
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_S, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_WRAP_T, gl.CLAMP_TO_EDGE);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MIN_FILTER, gl.NEAREST);
    gl.texParameteri(gl.TEXTURE_2D, gl.TEXTURE_MAG_FILTER, gl.NEAREST);

    return texture;
  }

  createFrameBuffer() {
    const gl = this.gl;
    var texture = createAndSetupTexture(gl);
    textures.push(texture);

    // 设置纹理大小和图像大小一致
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.canvas.width,
      gl.canvas.height,
      0,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      null
    );

    const fbo = gl.createFramebuffer();

    framebuffers.push(fbo);
    gl.bindFramebuffer(gl.FRAMEBUFFER, fbo);

    // 绑定纹理到帧缓冲
    gl.framebufferTexture2D(
      gl.FRAMEBUFFER,
      gl.COLOR_ATTACHMENT0,
      gl.TEXTURE_2D,
      texture,
      0
    );
  }

  renderOneShadow(x, y) {
    const gl = this.gl;
    gl.blendFunc(gl.ONE, gl.ONE);

    gl.enable(gl.BLEND);

    const program = this.program;

    // 片元裁切范围
    this.bindBufferData("a_position", this.createRect(x, y));

    // 权重
    const weightLocation = gl.getUniformLocation(program, "u_weight");

    this.enableVertextAttrib("a_position", {
      size: 2,
      type: gl.FLOAT,
      normalize: false,
      stride: 0,
      offset: 0,
    });

    gl.uniform1f(weightLocation, Math.random());

    // Draw the rectangle.
    const primitiveType = gl.TRIANGLES;
    const offset = 0;
    const count = 6;
    gl.drawArrays(primitiveType, offset, count);

    gl.disable(gl.BLEND);
  }

  render() {
    // this.renderOneShadow(60, 60);
    const gl = this.gl;
    const program = this.program;

    // 图像裁切范围
    this.bindBufferData(
      "a_texCoord",
      new Float32Array([
        0.0, 0.0, 1.0, 0.0, 0.0, 1.0, 0.0, 1.0, 1.0, 0.0, 1.0, 1.0,
      ]),
      gl.STATIC_DRAW
    );

    // 坐标变换
    const resolutionLocation = gl.getUniformLocation(program, "u_resolution");
    gl.useProgram(program);

    gl.uniform2f(resolutionLocation, gl.canvas.width, gl.canvas.height);

    this.enableVertextAttrib("a_texCoord", {
      size: 2,
      type: gl.FLOAT,
      normalize: false,
      stride: 0,
      offset: 0,
    });

    const texture = this.createAndSetupTexture();
    // 将图像上传到纹理
    gl.texImage2D(
      gl.TEXTURE_2D,
      0,
      gl.RGBA,
      gl.RGBA,
      gl.UNSIGNED_BYTE,
      this.circle
    );

    for (let i = 0; i < 100; i++) {
      const x = Math.floor(Math.random() * 800);
      const y = Math.floor(Math.random() * 600);

      this.renderOneShadow(x, y);
    }
  }
}

class HeatmapGL {
  constructor(canvas, data, options) {
    this.canvas = canvas;
    this.data = data;
    this.options = options;

    this.gl = this.canvas.getContext("webgl");
    this.locations = {};
    this.buffers = {};

    this.programs = [];
  }

  addProgram(program) {
    this.programs.push(program);
  }

  render() {
    const gl = this.gl;

    gl.viewport(0, 0, gl.canvas.width, gl.canvas.height);
    gl.clearColor(0, 0, 0, 0);
    gl.clear(gl.COLOR_BUFFER_BIT);
    gl.enable(gl.BLEND);

    for (const program of this.programs) {
      program.render();
    }
  }
}

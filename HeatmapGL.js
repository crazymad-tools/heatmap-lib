function isDefined(val) {
  return val !== undefined && val !== null && val !== NaN;
}

class ShadowProgram extends WebglProgram {
  drawCircle() {
    const canvas = document.createElement("canvas");
    const context = canvas.getContext("2d");

    canvas.width = 60;
    canvas.height = 60;

    // context.fillStyle = "black";

    context.shadowOffsetX = context.shadowOffsetY = 60;
    context.shadowBlur = 15;
    context.shadowColor = "black";

    context.beginPath();
    context.arc(-30, -30, 15, 0, Math.PI * 2);
    context.closePath();
    context.fill();

    this.circle = canvas;
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

  render() {

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

    for (const program of this.programs) {
      program.render();
    }
  }
}

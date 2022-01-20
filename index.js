function isDefined(val) {
  return val !== undefined && val !== null && val !== NaN;
}

class Heatmap {
  constructor(canvas, data, options) {
    this.canvas = canvas;
    this.data = data ?? [];
    this.options = options ?? {};

    this.context = this.canvas.getContext("2d");

    this.drawCircle();
    this.drawGradient();
  }

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

    console.log(canvas.toDataURL());

    this.gradient = context;
  }

  getMaxMin() {
    if (isDefined(this.options.max) && isDefined(this.options.min)) {
      return {
        max: this.options.max,
        min: this.options.min,
      };
    }

    let max = -Infinity;
    let min = Infinity;

    for (let i = 0; i < this.data.length; i++) {
      max = Math.max(max, this.data[i].weight);
      min = Math.min(min, this.data[i].weight);
    }

    return {
      max,
      min,
    };
  }

  mixinColor() {
    const id = this.context.getImageData(
      0,
      0,
      this.canvas.width,
      this.canvas.height
    );
    const pixels = id.data;
    const len = this.canvas.width * this.canvas.height;

    const colors = this.gradient.getImageData(0, 0, 256, 1).data;

    for (let i = 0; i < len; i++) {
      if (!pixels[i * 4 + 3]) continue;

      // console.log(pixels[i * 4 + 3]);
      const color_idx = pixels[i * 4 + 3];
      pixels[i * 4] = colors[color_idx * 4];
      pixels[i * 4 + 1] = colors[color_idx * 4 + 1];
      pixels[i * 4 + 2] = colors[color_idx * 4 + 2];
    }

    this.context.putImageData(id, 0, 0);
  }

  draw() {
    const width = this.canvas.width;
    const height = this.canvas.height;
    const { max, min } = this.getMaxMin();

    this.context.clearRect(0, 0, this.canvas.width, this.canvas.height);

    for (const item of this.data) {
      this.context.globalAlpha = (item.weight - min) / (max - min);
      this.context.drawImage(
        this.circle,
        item.x * width - 30,
        item.y * height - 30
      );
    }

    this.mixinColor();
  }
}

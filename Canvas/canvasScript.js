let canvas;
let context;


const init = () => {
  canvas = document.getElementById('canvas');
  // This obtains the context and the drawing functions associated to it
  context = canvas.getContext('2d');
  draw();
};

const draw = () => {
  context.fillStyle = "#ff0000";
  context.fillRect(30, 30, 50, 50); // (x, y, width, height)

  context.fillStyle = "rgba(0, 0, 200, 0.5)";
  context.fillRect(45, 45, 50, 50);

  // We begin a path, then move the pen, then draw a line. We have to close the path after
  context.fillStyle = "rgb(0, 0, 0)";
  context.beginPath();
  context.moveTo(105, 95);
  context.lineTo(175, 95);
  context.closePath();
  context.fill();
};

init();
import { useEffect } from "react";

function App() {
  // canvas
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);
  const pixelSize = 1;

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    for (let j = canvasHeight - 1; j > 0; j -= pixelSize) {
      for (let i = 0; i < canvasWidth; i += pixelSize) {
        let r = i / canvasWidth;
        let g = j / canvasHeight;
        let b = 0.25;
        let ir = 255.0 * r;
        let ig = 255.0 * g;
        let ib = 255.0 * b;
        ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, 1)`;
        ctx.fillRect(i, j, 10, 10);
      }
    }
  };

  useEffect(() => {
    const canvas = document.getElementById("myCanvas") as HTMLCanvasElement;
    const ctx = canvas.getContext("2d") as CanvasRenderingContext2D;

    drawImage(ctx);
  }, []);

  return (
    <div className="App">
      <canvas id="myCanvas" width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  );
}

export default App;

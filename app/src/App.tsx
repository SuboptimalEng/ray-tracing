import { useEffect, useState } from "react";

const IMAGE_SIZE = 400;

function App() {
  const imageWidth = IMAGE_SIZE;
  const imageHeight = IMAGE_SIZE;

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    for (let i = 0; i < imageWidth; i++) {
      for (let j = 0; j < imageHeight; j++) {
        let r = i / imageWidth;
        let g = j / imageHeight;
        let b = 0.25;

        let ir = 255.0 * r;
        let ig = 255.0 * g;
        let ib = 255.0 * b;

        ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, 1)`;
        ctx.fillRect(i, j, 1, 1);
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
      <canvas id="myCanvas" width={IMAGE_SIZE} height={IMAGE_SIZE}></canvas>
    </div>
  );
}

export default App;

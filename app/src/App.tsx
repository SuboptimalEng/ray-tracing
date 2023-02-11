import { useEffect, useState } from "react";
import { Vec3 } from "./packages/Vec3";

const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = 300;

function App() {
  const canvasWidth = CANVAS_WIDTH;
  const canvasHeight = CANVAS_HEIGHT;

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    const point = new Vec3();
    const color = new Vec3();

    const unit = new Vec3(1.0, 1.0, 1.0);

    point.add(unit);

    console.log(point);

    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        let r = i / canvasWidth;
        let g = j / canvasHeight;
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
      <canvas id="myCanvas" width={canvasWidth} height={canvasHeight}></canvas>
    </div>
  );
}

export default App;

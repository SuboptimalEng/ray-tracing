import { useEffect, useState } from "react";
import { Ray } from "./packages/Ray";
import { Vec3, vadd, vscale } from "./packages/Vec3";

const ASPECT_RATIO = 16.0 / 9.0;
const CANVAS_WIDTH = 400;
const CANVAS_HEIGHT = Math.floor(CANVAS_WIDTH / ASPECT_RATIO);

function App() {
  // camera

  const rayColor = (r: Ray): Vec3 => {
    const unitDirection: Vec3 = new Vec3(
      r.direction.x,
      r.direction.y,
      r.direction.z
    ).unitVector();
    const t = 0.5 * (unitDirection.y + 1.0);
    const white = new Vec3(1.0, 1.0, 1.0);
    const skyBlue = new Vec3(0.5, 0.7, 1.0);
    return vadd(vscale(white, 1.0 - t), vscale(skyBlue, t));
  };

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    const point = new Vec3();
    const color = new Vec3();

    const unit = new Vec3(1.0, 1.0, 1.0);

    point.add(unit);

    console.log(point);

    for (let i = 0; i < CANVAS_WIDTH; i++) {
      for (let j = 0; j < CANVAS_HEIGHT; j++) {
        let r = i / CANVAS_WIDTH;
        let g = j / CANVAS_HEIGHT;
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
      <canvas
        id="myCanvas"
        width={CANVAS_WIDTH}
        height={CANVAS_HEIGHT}
      ></canvas>
    </div>
  );
}

export default App;

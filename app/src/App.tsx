import { useEffect, useState } from "react";
import { Ray } from "./packages/Ray";
import { Vec3, vadd, vsub, vscale } from "./packages/Vec3";

function App() {
  // canvas
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);

  // camera
  const viewportHeight = 2.0;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1.0;

  const origin = new Vec3(0.0, 0.0, 0.0);
  const horizontal = new Vec3(viewportWidth, 0.0, 0.0);
  const vertical = new Vec3(0.0, viewportHeight, 0.0);

  const scaledHorizontal = vscale(horizontal, 0.5);
  const scaledVertical = vscale(vertical, 0.5);

  let upperLeftCorner = vadd(origin, scaledHorizontal);
  upperLeftCorner = vadd(upperLeftCorner, scaledVertical);
  upperLeftCorner = vsub(upperLeftCorner, new Vec3(0.0, 0.0, focalLength));

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
    for (let i = 0; i < canvasWidth; i++) {
      for (let j = 0; j < canvasHeight; j++) {
        const u = i / (canvasWidth - 1);
        const v = i / (canvasHeight - 1);

        const uHorizontal = vscale(horizontal, u);
        const vVerical = vscale(vertical, v);
        let rayDirection = vadd(origin, uHorizontal);
        rayDirection = vadd(rayDirection, vVerical);
        rayDirection = vsub(rayDirection, origin);
        const r: Ray = new Ray(origin, rayDirection);

        const color = rayColor(r);
        // console.log(color, i, j);
        // console.log(i, j);
        ctx.fillStyle = `rgba(${color.x}, ${color.y}, ${color.z}, 1)`;
        ctx.fillRect(i, j, 1, 1);

        // let r = i / canvasWidth;
        // let g = j / canvasHeight;
        // let b = 0.25;
        // let ir = 255.0 * r;
        // let ig = 255.0 * g;
        // let ib = 255.0 * b;
        // ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, 1)`;
        // ctx.fillRect(i, j, 1, 1);
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
        width={canvasWidth + 100}
        height={canvasHeight + 100}
      ></canvas>
    </div>
  );
}

export default App;

import { useEffect, useState } from "react";
import { Ray } from "./packages/Ray";
import { Vec3, vadd, vsub, vscale } from "./packages/Vec3";

const rayColor = (r: Ray): Vec3 => {
  const unitDirection = r.unitVector();
  const t = 0.5 * (unitDirection.y + 1.0);
  const white = new Vec3(1.0, 1.0, 1.0);
  const black = new Vec3(0.0, 0.0, 0.0);
  const skyBlue = new Vec3(0.5, 0.7, 1.0);
  // return vscale(vadd(vscale(white, 1.0 - t), vscale(black, t)), 255);
  return vscale(vadd(vscale(white, 1.0 - t), vscale(skyBlue, t)), 255);
};

function App() {
  // canvas
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);
  const pixelSize = 10;

  // camera
  const viewportHeight = 2.0;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1.0;

  const origin = new Vec3(0.0, 0.0, 0.0);
  const horizontal = new Vec3(viewportWidth, 0.0, 0.0);
  const vertical = new Vec3(0.0, viewportHeight, 0.0);

  let lowerLeftCorner = origin;
  lowerLeftCorner = vsub(lowerLeftCorner, vscale(horizontal, 0.5));
  lowerLeftCorner = vsub(lowerLeftCorner, vscale(vertical, 0.5));
  lowerLeftCorner = vsub(lowerLeftCorner, new Vec3(0.0, 0.0, focalLength));

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    for (let j = canvasHeight - 1; j > 0; j -= pixelSize) {
      for (let i = 0; i < canvasWidth; i += pixelSize) {
        const u = i / (canvasWidth - 1);
        const v = j / (canvasHeight - 1);

        const uHorizontal = vscale(horizontal, u);
        const vVerical = vscale(vertical, v);
        let rayDirection = vadd(lowerLeftCorner, uHorizontal);
        rayDirection = vadd(rayDirection, vVerical);
        rayDirection = vsub(rayDirection, origin);
        const r: Ray = new Ray(origin, rayDirection);

        const color = rayColor(r);
        ctx.fillStyle = `rgba(${color.x}, ${color.y}, ${color.z}, 1)`;
        // note: paints down as j increases in height, this is done for ease of use
        ctx.fillRect(i, canvasHeight - j, pixelSize, pixelSize);

        // let r = i / canvasWidth;
        // let g = j / canvasHeight;
        // let b = 0.25;
        // let ir = 255.0 * r;
        // let ig = 255.0 * g;
        // let ib = 255.0 * b;
        // ctx.fillStyle = `rgba(${ir}, ${ig}, ${ib}, 1)`;
        // ctx.fillRect(i, j, 1, 1);
      }
      // debugger;
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

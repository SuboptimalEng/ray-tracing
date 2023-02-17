import { useEffect } from "react";
import { Camera } from "./packages/Camera";
import { HittableList } from "./packages/HittableList";
import { Ray } from "./packages/Ray";
import { Sphere } from "./packages/Sphere";
import {
  Vec3,
  vadd,
  vscale,
  clamp,
  vsub,
  randomInHemisphere,
  randomInUnitSphere,
  randomUnitVector,
} from "./packages/Vec3";

const rayColorPerPixelFn = (
  pixelColor: Vec3,
  samplesPerPixel: number
): Vec3 => {
  let r = pixelColor.x;
  let g = pixelColor.y;
  let b = pixelColor.z;

  const scale = 1.0 / samplesPerPixel;
  // r *= scale;
  // g *= scale;
  // b *= scale;

  // gamma correction
  r = Math.sqrt(r * scale);
  g = Math.sqrt(g * scale);
  b = Math.sqrt(b * scale);

  return new Vec3(
    clamp(0, 0.99, r) * 255,
    clamp(0, 0.99, g) * 255,
    clamp(0, 0.99, b) * 255
  );
};

const rayColor = (r: Ray, world: HittableList, depth: number): Vec3 => {
  const red = new Vec3(1.0, 0.0, 0.0);
  const white = new Vec3(1.0, 1.0, 1.0);
  const skyBlue = new Vec3(0.5, 0.7, 1.0);

  if (depth <= 0) {
    return new Vec3(0.0, 0.0, 0.0);
  }

  if (world.hit(r, 0.001, Infinity)) {
    // old (proven incorrect) target
    // const target: Vec3 = vadd(
    //   vadd(world.hr.p as Vec3, world.hr.normal as Vec3),
    //   // randomInUnitSphere() // 1. first method
    //   randomUnitVector() // 2. second method
    // );

    // new (proven correct) method
    const target: Vec3 = vadd(
      world.hr.p as Vec3,
      randomInHemisphere(world.hr.normal as Vec3)
    );
    return vscale(
      rayColor(
        new Ray(world.hr.p as Vec3, vsub(target, world.hr.p as Vec3)),
        world,
        depth - 1
      ),
      0.5
    );
  }

  const unitDirection = r.unitVector();
  const t = 0.5 * (unitDirection.y + 1.0);
  return vadd(vscale(white, 1.0 - t), vscale(skyBlue, t));
};

function App() {
  // canvas
  const FACTOR = 20;
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);
  const pixelSize = 1;
  const samplesPerPixel = FACTOR;
  const maxDepth = FACTOR;

  const cam: Camera = new Camera();
  const world: HittableList = new HittableList();
  world.objects.push(new Sphere(new Vec3(0, 0, -1), 0.5));
  world.objects.push(new Sphere(new Vec3(0, -100.5, -1), 100.0));

  const drawImage = (ctx: CanvasRenderingContext2D) => {
    for (let j = canvasHeight - 1; j > 0; j -= pixelSize) {
      for (let i = 0; i < canvasWidth; i += pixelSize) {
        // antialiasing via the sampling method
        let color = new Vec3(0.0, 0.0, 0.0);
        for (let s = 0; s < samplesPerPixel; s++) {
          const u: number = (i + Math.random() * 0.1) / (canvasWidth - 1);
          const v: number = (j + Math.random() * 0.1) / (canvasHeight - 1);
          const r: Ray = cam.getRay(u, v);
          color = vadd(color, rayColor(r, world, maxDepth));
        }
        color = rayColorPerPixelFn(color, samplesPerPixel);

        ctx.fillStyle = `rgba(${color.x}, ${color.y}, ${color.z}, 1)`;
        // note: paints down as j increases in height, this is done for ease of use
        ctx.fillRect(i, canvasHeight - j, pixelSize, pixelSize);
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

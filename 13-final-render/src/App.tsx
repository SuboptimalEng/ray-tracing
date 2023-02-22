import { useEffect } from "react";
import { Camera } from "./packages/Camera";
import { Dielectric } from "./packages/Dielectric";
import { HittableList } from "./packages/HittableList";
import { Lambertian } from "./packages/Lambertian";
import { Metal } from "./packages/Metal";
import { Ray } from "./packages/Ray";
import { Sphere } from "./packages/Sphere";
import {
  Vec3,
  vadd,
  vscale,
  clamp,
  vmul,
  vsub,
  randomVec3Bounded,
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
  const white = new Vec3(1.0, 1.0, 1.0);
  const skyBlue = new Vec3(0.5, 0.7, 1.0);

  if (depth <= 0) {
    return new Vec3(0.0, 0.0, 0.0);
  }

  if (world.hit(r, 0.001, Infinity)) {
    let scattered: Ray = new Ray(new Vec3(0, 0, 0), new Vec3(0, 0, 0));
    let attenuation: Vec3 = new Vec3(0, 0, 0);
    if (world.hr.material.scatter(r, world.hr, attenuation, scattered)) {
      return vmul(rayColor(scattered, world, depth - 1), attenuation);
    }

    return new Vec3(0.0, 0.0, 0.0);
  }

  const unitDirection = r.unitVector();
  const t = 0.5 * (unitDirection.y + 1.0);
  return vadd(vscale(white, 1.0 - t), vscale(skyBlue, t));
};

const randomScene = () => {
  const world: HittableList = new HittableList();

  const groundMaterial = new Lambertian(new Vec3(0.5, 0.5, 0.5));
  world.objects.push(new Sphere(new Vec3(0, -1000, 0), 1000, groundMaterial));

  const NUM_OF_ROWS = 4;

  for (let a = -NUM_OF_ROWS; a < NUM_OF_ROWS; a++) {
    for (let b = -NUM_OF_ROWS; b < NUM_OF_ROWS; b++) {
      const chooseMaterial = Math.random();
      const center: Vec3 = new Vec3(
        a + 0.9 * Math.random(),
        0.2,
        b + 0.9 * Math.random()
      );

      if (vsub(center, new Vec3(4, 0.2, 0)).length() > 0.9) {
        let sphereMaterial;
        if (chooseMaterial < 0.8) {
          // diffuse
          const albedo = new Vec3(
            Math.random() * Math.random(),
            Math.random() * Math.random(),
            Math.random() * Math.random()
          );
          sphereMaterial = new Lambertian(albedo);
          world.objects.push(new Sphere(center, 0.2, sphereMaterial));
        } else if (chooseMaterial < 0.95) {
          // metal
          const albedo = randomVec3Bounded(0.5, 1);
          const fuzz = Math.random() * 0.5;
          sphereMaterial = new Metal(albedo, fuzz);
          world.objects.push(new Sphere(center, 0.2, sphereMaterial));
        } else {
          // glass
          sphereMaterial = new Dielectric(1.5);
          world.objects.push(new Sphere(center, 0.2, sphereMaterial));
        }
      }
    }
  }

  const material1 = new Dielectric(1.5);
  world.objects.push(new Sphere(new Vec3(0, 1, 0), 1.0, material1));

  const material2 = new Lambertian(new Vec3(0.4, 0.2, 0.1));
  world.objects.push(new Sphere(new Vec3(-4, 1, 0), 1.0, material2));

  const material3 = new Metal(new Vec3(0.7, 0.6, 0.5), 0.0);
  world.objects.push(new Sphere(new Vec3(4, 1, 0), 1.0, material3));

  return world;
};

function App() {
  // canvas
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  // const aspectRatio = 3.0 / 2.0;
  // const canvasWidth = 900;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);
  const pixelSize = 1;
  const samplesPerPixel = 25;
  const maxDepth = 10;

  const world = randomScene();

  const lookFrom = new Vec3(13, 2.5, 3);
  const lookAt = new Vec3(0, 0, 0);
  const vup = new Vec3(0, 1, 0);
  const aperture = 0.1;
  const distanceToFocus = 10;

  const cam: Camera = new Camera(
    lookFrom,
    lookAt,
    vup,
    20,
    aspectRatio,
    aperture,
    distanceToFocus
  );

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

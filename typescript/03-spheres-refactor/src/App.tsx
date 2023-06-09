import { useEffect, useState } from "react";
import { HitRecord } from "./packages/HitRecord";
import { HittableList } from "./packages/HittableList";
import { Ray } from "./packages/Ray";
import { Sphere } from "./packages/Sphere";
import { Vec3, dot, vadd, vsub, vscale, unitVector } from "./packages/Vec3";

const hitSphere = (center: Vec3, radius: number, ray: Ray): number => {
  const oc: Vec3 = vsub(ray.origin, center);
  // slow
  // const a: number = dot(ray.direction, ray.direction);
  // const b: number = 2.0 * dot(oc, ray.direction);
  // const c: number = dot(oc, oc) - radius * radius;
  // const discriminant: number = b * b - 4 * a * c;

  // fast
  const a: number = ray.direction.lengthSquared();
  const half_b: number = dot(oc, ray.direction);
  const c: number = oc.lengthSquared() - radius * radius;
  const discriminant: number = half_b * half_b - a * c;

  if (discriminant < 0) {
    return -1.0;
  } else {
    // return (-b - Math.sqrt(discriminant)) / (2.0 * a);
    return (-half_b - Math.sqrt(discriminant)) / a;
  }
};

const rayColor = (r: Ray, world: HittableList): Vec3 => {
  const red = new Vec3(1.0, 0.0, 0.0);
  const white = new Vec3(1.0, 1.0, 1.0);
  const skyBlue = new Vec3(0.5, 0.7, 1.0);

  const hr: HitRecord = new HitRecord();
  if (world.hit(r, 0, Infinity, hr)) {
    // return vscale(vadd(hr.normal as Vec3, new Vec3(1, 1, 1)), 0.5);
    return vscale(
      vscale(vadd(world.hr.normal as Vec3, new Vec3(1, 1, 1)), 0.5),
      255
    );
  }

  // let t = hitSphere(new Vec3(0, 0, -1), 0.5, r);
  // if (t > 0.0) {
  //   let N: Vec3 = unitVector(vsub(r.at(t), new Vec3(0.0, 0.0, -1.0)));
  //   return vscale(vscale(new Vec3(N.x + 1, N.y + 1, N.z + 1), 0.5), 255);
  // }
  // if (hitSphere(new Vec3(0, 0, -1), 0.5, r)) {
  //   return vscale(red, 255);
  // }

  const unitDirection = r.unitVector();
  const t = 0.5 * (unitDirection.y + 1.0);
  // t = 0.5 * (unitDirection.y + 1.0);
  // return vscale(vadd(vscale(white, 1.0 - t), vscale(red, t)), 255);
  return vscale(vadd(vscale(white, 1.0 - t), vscale(skyBlue, t)), 255);
};

function App() {
  // canvas
  const aspectRatio = 16.0 / 9.0;
  const canvasWidth = 400;
  const canvasHeight = Math.floor(canvasWidth / aspectRatio);
  const pixelSize = 1;

  // camera
  const viewportHeight = 2.0;
  const viewportWidth = aspectRatio * viewportHeight;
  const focalLength = 1.0;

  const world: HittableList = new HittableList();
  world.objects.push(new Sphere(new Vec3(0, 0, -1), 0.5));
  world.objects.push(new Sphere(new Vec3(0, -100.5, -1), 100.0));

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

        const color = rayColor(r, world);
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

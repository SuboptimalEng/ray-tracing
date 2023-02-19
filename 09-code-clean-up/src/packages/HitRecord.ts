import { Lambertian } from "./Lambertian";
import { Metal } from "./Metal";
import { Ray } from "./Ray";
import { dot, Vec3, vscale } from "./Vec3";

class HitRecord {
  p: Vec3 | undefined;
  t: number | undefined;
  normal: Vec3 | undefined;
  frontFace: boolean | undefined;
  material: Lambertian | Metal;

  constructor() {
    this.material = new Lambertian(new Vec3(0.0, 0.0, 0.0), 0.0);
  }

  setFaceNormal(r: Ray, outwardNormal: Vec3) {
    this.frontFace = dot(r.direction, outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : vscale(outwardNormal, -1.0);
  }
}

export { HitRecord };

import { Ray } from "./Ray";
import { dot, Vec3, vscale } from "./Vec3";

class HitRecord {
  p: Vec3 | undefined;
  t: number | undefined;
  normal: Vec3 | undefined;
  frontFace: boolean | undefined;

  setFaceNormal(r: Ray, outwardNormal: Vec3) {
    this.frontFace = dot(r.direction, outwardNormal) < 0;
    this.normal = this.frontFace ? outwardNormal : vscale(outwardNormal, -1.0);
  }
}

export { HitRecord };

import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { dot, Vec3, vscale, vsub } from "./Vec3";

class Sphere {
  center: Vec3;
  hr: HitRecord;
  radius: number;

  constructor(p: Vec3, r: number) {
    this.radius = r;
    this.center = new Vec3(p.x, p.y, p.z);
    this.hr = new HitRecord();
  }

  hit(r: Ray, tMin: number, tMax: number, hr: HitRecord) {
    const oc: Vec3 = vsub(r.origin, this.center);
    const a: number = r.direction.lengthSquared();
    const half_b: number = dot(oc, r.direction);
    const c: number = oc.lengthSquared() - this.radius * this.radius;
    const discriminant: number = half_b * half_b - a * c;
    if (discriminant < 0) {
      return false;
    }

    const sqrtd = Math.sqrt(discriminant);
    let root = (-half_b - sqrtd) / a;
    if (root < tMin || root > tMax) {
      root = (-half_b + sqrtd) / a;
      if (root < tMin || root > tMax) {
        return false;
      }
    }

    this.hr = hr;
    this.hr.t = root;
    this.hr.p = r.at(this.hr.t);
    // this.hr.normal = vscale(vsub(this.hr.p, this.center), 1 / this.radius);
    const outwardNormal: Vec3 = vscale(
      vsub(this.hr.p, this.center),
      1.0 / this.radius
    );
    this.hr.setFaceNormal(r, outwardNormal);

    return true;
  }
}

export { Sphere };

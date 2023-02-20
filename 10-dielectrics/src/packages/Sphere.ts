import { Dielectric } from "./Dielectric";
import { HitRecord } from "./HitRecord";
import { Lambertian } from "./Lambertian";
import { Metal } from "./Metal";
import { Ray } from "./Ray";
import { dot, Vec3, vscale, vsub } from "./Vec3";

export type MaterialTypes_t = Lambertian | Metal | Dielectric;

class Sphere {
  center: Vec3;
  hr: HitRecord;
  radius: number;
  material: MaterialTypes_t;

  constructor(p: Vec3, r: number, material: MaterialTypes_t) {
    this.radius = r;
    this.center = new Vec3(p.x, p.y, p.z);
    this.hr = new HitRecord();
    this.material = material;
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
    this.hr.material = this.material;
    const outwardNormal: Vec3 = vscale(
      vsub(this.hr.p, this.center),
      1.0 / this.radius
    );
    this.hr.setFaceNormal(r, outwardNormal);

    return true;
  }
}

export { Sphere };

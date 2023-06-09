import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { randomUnitVector, vadd, Vec3 } from "./Vec3";

class Lambertian {
  albedo: Vec3;
  fuzz: number;

  constructor(color: Vec3, fuzz = 0) {
    this.albedo = new Vec3(color.x, color.y, color.z);
    this.fuzz = fuzz;
  }

  scatter(rayIn: Ray, hr: HitRecord, attenuation: Vec3, scattered: Ray) {
    let scatterDirection = vadd(hr.normal as Vec3, randomUnitVector());

    // pass by reference
    let scatteredTmp = new Ray(hr.p as Vec3, scatterDirection);
    scattered.origin = scatteredTmp.origin;
    scattered.direction = scatteredTmp.direction;

    if (scatterDirection.nearZero()) {
      scatterDirection = new Vec3(hr.normal?.x, hr.normal?.y, hr.normal?.z);
    }

    // pass by reference
    attenuation.x = this.albedo.x;
    attenuation.y = this.albedo.y;
    attenuation.z = this.albedo.z;
    return true;
  }
}

export { Lambertian };

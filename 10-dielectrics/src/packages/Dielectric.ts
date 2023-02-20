import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { refract, unitVector, Vec3 } from "./Vec3";

class Dielectric {
  ir: number;

  constructor(ir: number) {
    this.ir = ir;
  }

  scatter(rayIn: Ray, hr: HitRecord, attenuation: Vec3, scattered: Ray) {
    // pass by reference
    attenuation.x = 1.0;
    attenuation.y = 1.0;
    attenuation.z = 1.0;

    const refractionRatio: number = hr.frontFace ? 1.0 / this.ir : this.ir;

    const unitDirection: Vec3 = unitVector(rayIn.direction);
    const refracted: Vec3 = refract(
      unitDirection,
      hr.normal as Vec3,
      refractionRatio
    );

    // pass by reference
    let scatteredTmp = new Ray(hr.p as Vec3, refracted);
    scattered.origin = scatteredTmp.origin;
    scattered.direction = scatteredTmp.direction;

    return true;
  }
}

export { Dielectric };

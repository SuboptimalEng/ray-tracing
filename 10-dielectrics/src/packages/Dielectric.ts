import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { dot, reflect, refract, unitVector, Vec3, vscale } from "./Vec3";

class Dielectric {
  ir: number;

  constructor(ir: number) {
    this.ir = ir;
  }

  private reflectance(cosine: number, refractionIndex: number) {
    // Use Schlick's approximation for reflectance.
    let r0: number = (1.0 - refractionIndex) / (1.0 + refractionIndex);
    r0 = r0 * r0;
    return r0 * (1.0 - r0) * Math.pow(1.0 - cosine, 5.0);
  }

  scatter(rayIn: Ray, hr: HitRecord, attenuation: Vec3, scattered: Ray) {
    // pass by reference
    attenuation.x = 1.0;
    attenuation.y = 1.0;
    attenuation.z = 1.0;

    const refractionRatio: number = hr.frontFace ? 1.0 / this.ir : this.ir;
    const unitDirection: Vec3 = unitVector(rayIn.direction);
    const cosTheta: number = Math.min(
      dot(vscale(unitDirection, -1), hr.normal as Vec3),
      1.0
    );
    const sinTheta: number = Math.sqrt(1.0 - cosTheta * cosTheta);
    const cannotRefract: boolean = refractionRatio * sinTheta > 1.0;
    let refractedOrReflectedDirection: Vec3;

    if (
      cannotRefract ||
      this.reflectance(cosTheta, refractionRatio) > Math.random()
    ) {
      refractedOrReflectedDirection = reflect(unitDirection, hr.normal as Vec3);
    } else {
      refractedOrReflectedDirection = refract(
        unitDirection,
        hr.normal as Vec3,
        refractionRatio
      );
    }

    // pass by reference
    let scatteredTmp = new Ray(hr.p as Vec3, refractedOrReflectedDirection);
    scattered.origin = scatteredTmp.origin;
    scattered.direction = scatteredTmp.direction;

    return true;
  }
}

export { Dielectric };

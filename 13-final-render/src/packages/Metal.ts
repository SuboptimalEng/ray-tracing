import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import {
  dot,
  randomInUnitSphere,
  reflect,
  unitVector,
  vadd,
  Vec3,
  vscale,
} from "./Vec3";

class Metal {
  albedo: Vec3;
  fuzz: number;

  constructor(color: Vec3, fuzz: number) {
    this.albedo = new Vec3(color.x, color.y, color.z);
    this.fuzz = fuzz < 1 ? fuzz : 1;
  }

  scatter(
    rayIn: Ray,
    hr: HitRecord,
    attenuation: Vec3,
    scattered: Ray
  ): boolean {
    const reflected: Vec3 = reflect(
      unitVector(rayIn.direction),
      hr.normal as Vec3
    );

    // pass by reference
    // let scatteredTmp = new Ray(hr.p as Vec3, reflected);
    let scatteredTmp = new Ray(
      hr.p as Vec3,
      vadd(reflected, vscale(randomInUnitSphere(), this.fuzz))
    );
    scattered.origin = scatteredTmp.origin;
    scattered.direction = scatteredTmp.direction;

    // pass by reference
    attenuation.x = this.albedo.x;
    attenuation.y = this.albedo.y;
    attenuation.z = this.albedo.z;

    return dot(scattered.direction, hr.normal as Vec3) > 0;
  }
}

export { Metal };

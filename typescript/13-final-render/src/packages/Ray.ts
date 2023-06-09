import { vadd, Vec3, vscale } from "./Vec3";

class Ray {
  origin: Vec3;
  direction: Vec3;

  constructor(origin: Vec3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t: number): Vec3 {
    // origin + t * direction
    return vadd(this.origin, vscale(this.direction, t));
  }

  unitVector(): Vec3 {
    const vectorLength = this.direction.length();
    return new Vec3(
      this.direction.x / vectorLength,
      this.direction.y / vectorLength,
      this.direction.z / vectorLength
    );
  }
}

export { Ray };

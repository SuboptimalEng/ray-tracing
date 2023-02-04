import { Vec3 } from "./Vec3";

class Ray {
  origin: Vec3;
  direction: Vec3;

  constructor(origin: Vec3, direction: Vec3) {
    this.origin = origin;
    this.direction = direction;
  }

  at(t: number): Vec3 {
    // origin + t * direction
    return this.origin.add(this.direction.scale(t));
  }
}

export { Ray };

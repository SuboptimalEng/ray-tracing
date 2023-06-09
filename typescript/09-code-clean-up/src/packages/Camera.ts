import { Ray } from "./Ray";
import { vadd, Vec3, vscale, vsub } from "./Vec3";

class Camera {
  aspectRatio: number;
  viewportHeight: number;
  viewportWidth: number;
  focalLength: number;

  #origin: Vec3;
  #horizontal: Vec3;
  #vertical: Vec3;
  #lowerLeftCorner: Vec3;

  constructor() {
    this.aspectRatio = 16.0 / 9.0;
    this.viewportHeight = 2.0;
    this.viewportWidth = this.aspectRatio * this.viewportHeight;
    this.focalLength = 1.0;

    this.#origin = new Vec3(0, 0, 0);
    this.#horizontal = new Vec3(this.viewportWidth, 0.0, 0.0);
    this.#vertical = new Vec3(0.0, this.viewportHeight, 0.0);

    let _lowerLeftCorer = new Vec3(
      this.#origin.x,
      this.#origin.y,
      this.#origin.z
    );
    _lowerLeftCorer = vsub(_lowerLeftCorer, vscale(this.#horizontal, 0.5));
    _lowerLeftCorer = vsub(_lowerLeftCorer, vscale(this.#vertical, 0.5));
    _lowerLeftCorer = vsub(
      _lowerLeftCorer,
      new Vec3(0.0, 0.0, this.focalLength)
    );
    this.#lowerLeftCorner = _lowerLeftCorer;
  }

  getRay(u: number, v: number): Ray {
    const uHorizontal = vscale(this.#horizontal, u);
    const vVerical = vscale(this.#vertical, v);
    let rayDirection = vadd(this.#lowerLeftCorner, uHorizontal);
    rayDirection = vadd(rayDirection, vVerical);
    rayDirection = vsub(rayDirection, this.#origin);
    return new Ray(this.#origin, rayDirection);
  }
}

export { Camera };

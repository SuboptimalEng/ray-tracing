import { Ray } from "./Ray";
import { cross, unitVector, vadd, Vec3, vscale, vsub } from "./Vec3";

class Camera {
  aspectRatio: number;
  viewportHeight: number;
  viewportWidth: number;
  focalLength: number;

  #origin: Vec3;
  #horizontal: Vec3;
  #vertical: Vec3;
  #lowerLeftCorner: Vec3;

  private degreesToRadians(degrees: number) {
    return (degrees * Math.PI) / 180;
  }

  constructor(
    lookFrom: Vec3,
    lookAt: Vec3,
    vup: Vec3,
    verticalFieldOfView: number,
    aspectRatio: number
  ) {
    const theta = this.degreesToRadians(verticalFieldOfView);
    const h = Math.tan(theta / 2.0);

    const w = unitVector(vsub(lookFrom, lookAt));
    const u = unitVector(cross(vup, w));
    const v = cross(w, u);

    this.aspectRatio = aspectRatio;
    this.viewportHeight = 2.0 * h;
    this.viewportWidth = this.aspectRatio * this.viewportHeight;
    this.focalLength = 1.0;

    this.#origin = new Vec3(lookFrom.x, lookFrom.y, lookFrom.z);
    this.#horizontal = vscale(u, this.viewportWidth);
    this.#vertical = vscale(v, this.viewportHeight);

    let _lowerLeftCorner = new Vec3(
      this.#origin.x,
      this.#origin.y,
      this.#origin.z
    );
    _lowerLeftCorner = vsub(_lowerLeftCorner, vscale(this.#horizontal, 0.5));
    _lowerLeftCorner = vsub(_lowerLeftCorner, vscale(this.#vertical, 0.5));
    _lowerLeftCorner = vsub(_lowerLeftCorner, w);
    this.#lowerLeftCorner = _lowerLeftCorner;
  }

  getRay(s: number, t: number): Ray {
    const sHorizontal = vscale(this.#horizontal, s);
    const tVerical = vscale(this.#vertical, t);
    let rayDirection = vadd(this.#lowerLeftCorner, sHorizontal);
    rayDirection = vadd(rayDirection, tVerical);
    rayDirection = vsub(rayDirection, this.#origin);
    return new Ray(this.#origin, rayDirection);
  }
}

export { Camera };

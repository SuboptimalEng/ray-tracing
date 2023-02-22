import { Ray } from "./Ray";
import {
  cross,
  randomInUnitDisk,
  unitVector,
  vadd,
  Vec3,
  vscale,
  vsub,
} from "./Vec3";

class Camera {
  aspectRatio: number;
  viewportHeight: number;
  viewportWidth: number;
  focalLength: number;
  u: Vec3;
  v: Vec3;
  w: Vec3;
  lensRadius: number;

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
    aspectRatio: number,
    aperture: number,
    focusDistance: number
  ) {
    const theta = this.degreesToRadians(verticalFieldOfView);
    const h = Math.tan(theta / 2.0);

    this.w = unitVector(vsub(lookFrom, lookAt));
    this.u = unitVector(cross(vup, this.w));
    this.v = cross(this.w, this.u);
    this.lensRadius = aperture / 2.0;

    this.aspectRatio = aspectRatio;
    this.viewportHeight = 2.0 * h;
    this.viewportWidth = this.aspectRatio * this.viewportHeight;
    this.focalLength = 1.0;

    this.#origin = new Vec3(lookFrom.x, lookFrom.y, lookFrom.z);
    this.#horizontal = vscale(
      vscale(this.u, this.viewportWidth),
      focusDistance
    );
    this.#vertical = vscale(vscale(this.v, this.viewportHeight), focusDistance);

    let _lowerLeftCorner = new Vec3(
      this.#origin.x,
      this.#origin.y,
      this.#origin.z
    );
    _lowerLeftCorner = vsub(_lowerLeftCorner, vscale(this.#horizontal, 0.5));
    _lowerLeftCorner = vsub(_lowerLeftCorner, vscale(this.#vertical, 0.5));
    _lowerLeftCorner = vsub(_lowerLeftCorner, vscale(this.w, focusDistance));
    this.#lowerLeftCorner = _lowerLeftCorner;
  }

  getRay(s: number, t: number): Ray {
    const rd: Vec3 = vscale(randomInUnitDisk(), this.lensRadius);
    const offset: Vec3 = vadd(vscale(this.u, rd.x), vscale(this.v, rd.y));

    let origin = vadd(this.#origin, offset);
    const sHorizontal = vscale(this.#horizontal, s);
    const tVerical = vscale(this.#vertical, t);
    let direction = vadd(this.#lowerLeftCorner, sHorizontal);
    direction = vadd(direction, tVerical);
    direction = vsub(direction, this.#origin);
    direction = vsub(direction, offset);
    return new Ray(origin, direction);
  }
}

export { Camera };

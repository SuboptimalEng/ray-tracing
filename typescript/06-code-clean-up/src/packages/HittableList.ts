import { HitRecord } from "./HitRecord";
import { Ray } from "./Ray";
import { Sphere } from "./Sphere";

class HittableList {
  hr: HitRecord;
  objects: Array<Sphere>;

  constructor() {
    this.objects = [];
    this.hr = new HitRecord();
  }

  hit(r: Ray, tMin: number, tMax: number) {
    let tmpHr: HitRecord = new HitRecord();
    let hitAnything: boolean = false;
    let closestSoFar: number = tMax;

    for (let i = 0; i < this.objects.length; i++) {
      let object = this.objects[i];
      if (object.hit(r, tMin, closestSoFar, tmpHr)) {
        hitAnything = true;
        closestSoFar = tmpHr.t as number;
        this.hr = tmpHr;
      }
    }

    return hitAnything;
  }
}

export { HittableList };

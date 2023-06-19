import { HitRecord } from "./HitRecord";
import { Lambertian } from "./Lambertian";
import { Metal } from "./Metal";
import { Ray } from "./Ray";
import { Sphere } from "./Sphere";
import { Vec3 } from "./Vec3";

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
        let material;
        let materialType = object.materialType;
        if (materialType === "Lambertian") {
          material = new Lambertian(
            new Vec3(
              object.material.albedo.x,
              object.material.albedo.y,
              object.material.albedo.y
            )
          );
        } else {
          material = new Metal(
            new Vec3(
              object.material.albedo.x,
              object.material.albedo.y,
              object.material.albedo.y
            ),
            object.material.fuzz
          );
        }
        this.hr = tmpHr;
        this.hr.material = material;
      }
    }

    return hitAnything;
  }
}

export { HittableList };

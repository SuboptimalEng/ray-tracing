class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  nearZero(): boolean {
    return (
      Math.abs(this.x) < 0.001 &&
      Math.abs(this.y) < 0.001 &&
      Math.abs(this.z) < 0.001
    );
  }
}

const cross = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(
    a.y * b.z - a.z * b.y,
    a.z * b.x - a.x * b.z,
    a.x * b.y - a.y * b.x
  );
};

const dot = (a: Vec3, b: Vec3): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

const vadd = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
};

const vsub = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
};

const vmul = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x * b.x, a.y * b.y, a.z * b.z);
};

const vscale = (a: Vec3, n: number): Vec3 => {
  return new Vec3(a.x * n, a.y * n, a.z * n);
};

const unitVector = (a: Vec3): Vec3 => {
  const vectorLength = a.length();
  return new Vec3(a.x / vectorLength, a.y / vectorLength, a.z / vectorLength);
};

const clamp = (minValue: number, maxValue: number, x: number) => {
  if (x < minValue) return minValue;
  if (x > maxValue) return maxValue;
  return x;
};

const randomVec3 = (): Vec3 => {
  return new Vec3(Math.random(), Math.random(), Math.random());
};

const reflect = (v: Vec3, n: Vec3) => {
  return vsub(v, vscale(n, 2 * dot(v, n)));
};

const refract = (uv: Vec3, n: Vec3, etaiOverEtat: number) => {
  const cosTheta: number = Math.min(dot(vscale(uv, -1), n), 1.0);
  const rayOutPerpendicular: Vec3 = vscale(
    vadd(uv, vscale(n, cosTheta)),
    etaiOverEtat
  );
  const rayOutParallel: Vec3 = vscale(
    n,
    -1.0 * Math.sqrt(Math.abs(1.0 - rayOutPerpendicular.lengthSquared()))
  );
  return vadd(rayOutPerpendicular, rayOutParallel);
};

const randomBounded = (min: number, max: number): number => {
  return Math.random() * (max - min) + min;
};

const randomVec3Bounded = (min: number, max: number): Vec3 => {
  return new Vec3(
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min
  );
};

const randomInUnitSphere = (): Vec3 => {
  while (true) {
    const p = randomVec3Bounded(-1, 1);
    if (p.lengthSquared() < 1) {
      return p;
    }
  }
};

const randomUnitVector = (): Vec3 => {
  return unitVector(randomInUnitSphere());
};

const randomInUnitDisk = (): Vec3 => {
  while (true) {
    const p = new Vec3(randomBounded(-1, 1), randomBounded(-1, 1), 0);
    if (p.lengthSquared() < 1) {
      return p;
    }
  }
};

const randomInHemisphere = (normal: Vec3) => {
  const inUnitSphere: Vec3 = randomInUnitSphere();
  if (dot(inUnitSphere, normal) > 0.0) {
    return inUnitSphere;
  } else {
    return vscale(inUnitSphere, -1.0);
  }
};

export {
  Vec3,
  cross,
  dot,
  vadd,
  vmul,
  vsub,
  vscale,
  clamp,
  unitVector,
  randomInHemisphere,
  randomInUnitDisk,
  randomInUnitSphere,
  randomUnitVector,
  randomVec3Bounded,
  reflect,
  refract,
};

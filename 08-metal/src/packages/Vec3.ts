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
}

const dot = (a: Vec3, b: Vec3): number => {
  return a.x * b.x + a.y * b.y + a.z * b.z;
};

const vadd = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
};

const vsub = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
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

const randomVec3Bounded = (min: number, max: number): Vec3 => {
  return new Vec3(
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min,
    Math.random() * (max - min) + min
  );
};

const randomInUnitSphere = () => {
  while (true) {
    const p = randomVec3Bounded(-1, 1);
    if (p.lengthSquared() < 1) {
      return p;
    }
  }
};

const randomUnitVector = () => {
  return unitVector(randomInUnitSphere());
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
  dot,
  vadd,
  vsub,
  vscale,
  clamp,
  unitVector,
  randomInHemisphere,
  randomInUnitSphere,
  randomUnitVector,
};

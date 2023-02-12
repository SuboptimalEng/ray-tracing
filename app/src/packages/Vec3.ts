class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
  }

  getNew() {
    return new Vec3(this.x, this.y, this.z);
  }

  add(v: Vec3): Vec3 {
    this.x += v.x;
    this.y += v.y;
    this.z += v.z;
    return new Vec3(this.x, this.y, this.z);
  }

  subtract(v: Vec3): void {
    this.x -= v.x;
    this.y -= v.y;
    this.z -= v.z;
  }

  multiply(v: Vec3): void {
    this.x *= v.x;
    this.y *= v.y;
    this.z *= v.z;
  }

  dot(v: Vec3): number {
    return this.x * v.x + this.y * v.y + this.z * v.z;
  }

  scale(n: number): Vec3 {
    this.x *= n;
    this.y *= n;
    this.z *= n;
    return new Vec3(this.x, this.y, this.z);
  }

  lengthSquared(): number {
    return this.x * this.x + this.y * this.y + this.z * this.z;
  }

  length(): number {
    return Math.sqrt(this.lengthSquared());
  }

  unitVector(): Vec3 {
    const vectorLength = this.length();
    return new Vec3(
      this.x / vectorLength,
      this.y / vectorLength,
      this.z / vectorLength
    );
  }
}

const vadd = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x + b.x, a.y + b.y, a.z + b.z);
};

const vsub = (a: Vec3, b: Vec3): Vec3 => {
  return new Vec3(a.x - b.x, a.y - b.y, a.z - b.z);
};

const vscale = (a: Vec3, n: number): Vec3 => {
  return new Vec3(a.x * n, a.y * n, a.z * n);
};

export { Vec3, vadd, vsub, vscale };

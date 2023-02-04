class Vec3 {
  x: number;
  y: number;
  z: number;

  constructor(x = 0, y = 0, z = 0) {
    this.x = x;
    this.y = y;
    this.z = z;
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
}

export { Vec3 };

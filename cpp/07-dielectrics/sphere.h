#ifndef SPHERE_H
#define SPHERE_H

#include "hittable.h"
#include "vec3.h"

class Sphere : public Hittable {
 public:
  Sphere() {}
  Sphere(Point3 c, double r, shared_ptr<Material> m) : center(c), radius(r), mat_ptr(m){};
  virtual bool hit(const Ray& r, double t_min, double t_max, hit_record& rec) const override;

 public:
  Point3 center;
  double radius;
  shared_ptr<Material> mat_ptr;
};

// notes on the sphere equation
// equation of sphere
// x^2 + y^2 + z^2 = r^2

// equation of sphere at center C
// (x - Cx)^2 + (y - Cy)^2 + (z - Cz)^2 = r^2

// vector from center C = (Cx, Cy, Cz) to point P = (x, y, z)
// dot((P - C), (P - C)) = (x - Cx)^2 + (y - Cy)^2 + (z - Cz)^2
// this can be thought of as the radius of the sphere
// dot((P - C), (P - C)) = r^2

// in our case, P(t) is the ray with origin A, and direction b
// dot((P(t) - C), (P(t) - C)) = r^2
// dot((A + tb - C), (A + tb - C)) = r^2
// simplifing this equation gives us this hit_sphere method
bool Sphere::hit(const Ray& r, double t_min, double t_max, hit_record& rec) const {
  Vec3 oc = r.origin() - center;
  auto a = r.direction().length_squared();
  auto half_b = dot(oc, r.direction());
  auto c = oc.length_squared() - radius * radius;

  auto discriminant = half_b * half_b - a * c;
  if (discriminant < 0) {
    return false;
  }
  auto sqrtd = sqrt(discriminant);

  auto root = (-half_b - sqrtd) / a;
  if (root < t_min || t_max < root) {
    root = (-half_b + sqrtd) / a;
    if (root < t_min || t_max < root) {
      return false;
    }
  }

  rec.t = root;
  rec.p = r.at(rec.t);

  // the normal can either always point towards the ray
  // or point in the direction of the surface
  // rec.normal = (rec.p - center) / radius;
  Vec3 outward_normal = (rec.p - center) / radius;
  rec.set_face_normal(r, outward_normal);
  rec.mat_ptr = mat_ptr;

  return true;
}

#endif
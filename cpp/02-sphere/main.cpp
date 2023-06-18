#include <iostream>
#include <string>
#include <vector>

#include "color.h"
#include "ray.h"
#include "vec3.h"

using namespace std;

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
double hit_sphere(const Point3& center, double radius, const Ray& r) {
  Vec3 oc = r.origin() - center;
  auto a = dot(r.direction(), r.direction());
  auto b = 2.0 * dot(oc, r.direction());
  auto c = dot(oc, oc) - radius * radius;
  auto discriminant = b * b - 4 * a * c;
  if (discriminant < 0) {
    return -1.0;
  } else {
    return (-b - sqrt(discriminant)) / (2.0 * a);
  }
}

// linearly blends white and blue depending on the y coords
// after scaling it from -1 <= y <= 1
Color ray_color(const Ray& r) {
  auto t = hit_sphere(Point3(0, 0, -1), 0.5, r);
  if (t > 0.0) {
    Vec3 N = unit_vector(r.at(t) - Vec3(0, 0, -1));
    return 0.5 * Color(N.x() + 1, N.y() + 1, N.z() + 1);
  }
  Vec3 unit_direction = unit_vector(r.direction());
  t = 0.5 * (unit_direction.y() + 1.0);
  return (1.0 - t) * Color(1.0, 1.0, 1.0) + t * Color(0.5, 0.7, 1.0);
}

int main() {
  // image
  const auto aspect_ratio = 16.0 / 9.0;
  const int image_width = 400;
  const int image_height = static_cast<int>(image_width / aspect_ratio);

  // camera
  auto viewport_height = 2.0;
  auto viewport_width = aspect_ratio * viewport_height;
  auto focal_length = 1.0;

  auto origin = Point3(0, 0, 0);
  auto horizontal = Vec3(viewport_width, 0, 0);
  auto vertical = Vec3(0, viewport_height, 0);
  auto lower_left_corner = origin - horizontal / 2 - vertical / 2 - Vec3(0, 0, focal_length);

  std::cout << "P3\n" << image_width << " " << image_height << "\n255\n";

  for (int j = image_height - 1; j >= 0; j--) {
    for (int i = 0; i < image_width; i++) {
      auto u = double(i) / (image_width - 1);
      auto v = double(j) / (image_height - 1);

      Vec3 rayOrigin = origin;
      Vec3 rayDirection = lower_left_corner + u * horizontal + v * vertical - origin;
      Ray r(rayOrigin, rayDirection);

      Color pixel_color = ray_color(r);
      write_color(std::cout, pixel_color);
    }
  }

  std::cout << "\nDone.\n";

  return 0;
}
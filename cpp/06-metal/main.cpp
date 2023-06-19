#include <iostream>
#include <string>
#include <vector>

#include "camera.h"
#include "color.h"
#include "hittable_list.h"
#include "material.h"
#include "rtweekend.h"
#include "sphere.h"

// linearly blends white and blue depending on the y coords
// after scaling it from -1 <= y <= 1
Color ray_color(const Ray& r, const Hittable& world, int depth) {
  hit_record rec;

  if (depth <= 0) {
    return Color(0, 0, 0);
  }

  if (world.hit(r, 0.001, infinity, rec)) {
    // Point3 target = rec.p + rec.normal + random_in_unit_sphere();
    // Point3 target = rec.p + rec.normal + random_unit_vector();

    // Point3 target = rec.p + random_in_hemisphere(rec.normal);
    // return 0.5 * ray_color(Ray(rec.p, target - rec.p), world, depth - 1);

    Ray scattered;
    Color attenuation;
    if (rec.mat_ptr->scatter(r, rec, attenuation, scattered)) {
      return attenuation * ray_color(scattered, world, depth - 1);
    }
    return Color(0, 0, 0);
  }
  Vec3 unit_direction = unit_vector(r.direction());
  auto t = 0.5 * (unit_direction.y() + 1.0);
  return (1.0 - t) * Color(1.0, 1.0, 1.0) + t * Color(0.5, 0.7, 1.0);
}

int main() {
  // image
  const auto aspect_ratio = 16.0 / 9.0;
  const int image_width = 800;
  const int image_height = static_cast<int>(image_width / aspect_ratio);
  const int samples_per_pixel = 24;
  const int max_depth = 8;

  // world
  HittableList world;

  auto material_ground = make_shared<Lambertian>(Color(0.8, 0.8, 0.0));
  auto material_center = make_shared<Lambertian>(Color(0.7, 0.3, 0.3));
  auto material_left = make_shared<Metal>(Color(0.8, 0.8, 0.8), 0.3);
  auto material_right = make_shared<Metal>(Color(0.8, 0.6, 0.2), 1.0);

  world.add(make_shared<Sphere>(Point3(0.0, -100.5, -1.0), 100.0, material_ground));
  world.add(make_shared<Sphere>(Point3(0.0, 0.0, -1.0), 0.5, material_center));
  world.add(make_shared<Sphere>(Point3(-1.0, 0.0, -1.0), 0.5, material_left));
  world.add(make_shared<Sphere>(Point3(1.0, 0.0, -1.0), 0.5, material_right));

  // camera
  Camera cam;

  std::cout << "P3\n" << image_width << " " << image_height << "\n255\n";

  for (int j = image_height - 1; j >= 0; j--) {
    std::cerr << "\rScanlines remaining: " << j << " " << std::flush;
    for (int i = 0; i < image_width; i++) {
      Color pixel_color(0, 0, 0);
      for (int s = 0; s < samples_per_pixel; s++) {
        auto u = (i + random_double()) / (image_width - 1);
        auto v = (j + random_double()) / (image_height - 1);
        Ray r = cam.get_ray(u, v);
        pixel_color += ray_color(r, world, max_depth);
      }
      write_color(std::cout, pixel_color, samples_per_pixel);
    }
  }

  std::cerr << "\nDone.\n";

  return 0;
}
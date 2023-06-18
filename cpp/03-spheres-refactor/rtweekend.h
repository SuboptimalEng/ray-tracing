#ifndef RTWEEKEND_H
#define RTWEEKEND_H

#include <cmath>
#include <limits>
#include <memory>

// usings
using std::make_shared;
using std::shared_ptr;
using std::sqrt;

// constants
const double infinity = std::numeric_limits<double>::infinity();
const double pi = 3.1415926535;

// utility functions
inline double degrees_to_radians(double degrees) { return degrees * pi / 180.0; }

// common headers
#include "ray.h"
#include "vec3.h"

#endif
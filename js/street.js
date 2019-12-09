class Street {
  constructor(pos, width, index) {
    this.pos = pos;
    this.width = width;

    this.index = index;
  }

  get offsets() {
    const ptLeft = this.pos.copy().add(p5.Vector.fromAngle(this.direction.heading() - PI/2, this.width))
    const ptRight = this.pos.copy().add(p5.Vector.fromAngle(this.direction.heading() + PI/2, this.width))

    return {right: ptRight, left: ptLeft}
  }

  get bounds() {
    // Calculate the offset point
    const {left, right} = this.offsets;

    // Calculate for next
    const offs_next = this.next.offsets;
    // Find the intersections left
    const inter_next_left = line_intersection(left, this.direction, offs_next.left, this.next.direction);
    // Find the intersections right
    const inter_next_right = line_intersection(right, this.direction, offs_next.right, this.next.direction);

    return {left: inter_next_left, right: inter_next_right};
  }

  get direction() {
    if(this.next && this.previous) {
      const dirN = this.next.pos.copy().sub(this.pos);
      const dirP = this.previous.pos.copy().sub(this.pos);
      const perpV = dirN.sub(dirP);
      const head = perpV.rotate(PI);
      return head;
    } else {
      return console.warn('Cannot calculate direction. Street has either no previous or next street. ')
    }
  }
}

Street.prototype.show = function() {
  // stroke(200);
  // strokeWeight(4)
  // point(this.pos.x, this.pos.y);

  // // Draw index
  // fill(255);
  // noStroke()
  // text(this.index, this.pos.x + 5, this.pos.y + 5, 16)

  // // Connect with next street
  // stroke(127);
  // strokeWeight(1)
  // line(this.pos.x, this.pos.y, this.next.pos.x, this.next.pos.y);

  // // Draw direction
  // stroke(color('red'));
  // const tempd = this.direction.add(this.pos);
  // line(this.pos.x, this.pos.y, tempd.x, tempd.y);

  // // Draw bounds
  // stroke(color('red'));
  // strokeWeight(6)
  // point(this.bounds.left.x, this.bounds.left.y);
  // point(this.bounds.right.x, this.bounds.right.y);
  // text(this.index, this.bounds.right.x, this.bounds.right.y)
}

Street.prototype.hits_wall = function(vehicle) {
  const a = this.bounds.left;
  const b = this.bounds.right;
  const dir1 = this.bounds.left.copy().sub(this.previous.bounds.left);
  const dir2 = this.bounds.right.copy().sub(this.previous.bounds.right);
  // const between = point_between_lines(vehicle.pos, a, dir1, b, dir2);

  const dist1 = distance_point_line(vehicle.pos, a, dir1);
  const dist2 = distance_point_line(vehicle.pos, b, dir2);

  const threshold = 5;

  return (dist1 < threshold || dist2 < threshold);
}

Street.prototype.connect = function(street) {
  if(street) {
    this.previous = street;
    street.next = this;
    return street;
  }
}

// a and b are first line, c and d are second line
// each line = point + x*direction
const line_intersection = function(a, b, c, d) {
  if(!(a instanceof p5.Vector && b instanceof p5.Vector && c instanceof p5.Vector && d instanceof p5.Vector)) {
    return new Error('Pass in four p5 vectors. ');
  } else {
    const int_a = a.copy();
    const int_b = b.copy();
    const int_c = c.copy();
    const int_d = d.copy();

    const diff = int_c.sub(int_a);
    const cross1 = diff.cross(int_d);
    const cross2 = int_b.cross(int_d);
    const len = cross1.mag() / cross2.mag();
    const sign =  cross1.dot(cross2) >= 0 ? 1 : -1;

    const inters = int_a.add(int_b.mult(sign * len));
    return inters;
  }
}

const vectors_parallel = function(a, b) {
  if(!(a instanceof p5.Vector && b instanceof p5.Vector)) {
    return new Error('Pass in two p5 vectors. ');
  } else {
    const int_a = a.copy();
    const int_b = b.copy();
    const dotP = int_a.dot(int_b);
    const mags = int_a.mag() * int_b.mag();

    return (dotP === mags);
  }
}

const distance_point_line = function(pt, a, dir) {
  const int_pt = pt.copy();
  const int_a = a.copy();
  const int_dir = dir.copy();

  const v1 = int_pt.sub(int_a);
  const top = v1.cross(int_dir).mag();
  const bottom = dir.mag();
  const dist = top / bottom;
  return dist;
}


const point_right_of_line = function(pt, a, dir) {
  const int_pt = pt.copy();
  const int_a = a.copy();
  const int_dir = dir.copy();

  const v1 = int_pt.sub(int_a);
  const h1 = v1.heading();
  const h2 = int_dir.heading();

  const sign =  v1.dot(dir) >= 0 ? 1 : -1;

  const right = (sign * h1 < h2)

  console.log(sign, right)

  return right;
}


const point_between_lines = function(pt, a, dir1, b, dir2) {
  const right1 = point_right_of_line(pt, a, dir1);
  const right2 = point_right_of_line(pt, b, dir2);

  const sign =  dir1.dot(dir2) >= 0;

  const right = sign ? right1 != right2 : right1 == right2;
  console.log(right1, right2, sign, right)
  return right;
}

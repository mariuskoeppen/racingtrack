class RacingTrack {
  track = [];

  constructor(center, shape, track) {
    this.center = center;

    this.shape = shape || new Shape({
      formula: function(a, r) {
        const x = r*cos(a);
        const y = r*sin(a);
        return {x, y};
      },
      steps: accuracy,
      radius: radius,
      name: 'circle',
    });

    this.track = track || this.new_track(this.shape, 50);

  }
}

RacingTrack.prototype.new_track = function(shape, width = 50) {
  let first = null;
  let previous = null;

  let track = [];


  for(let i = 0; i < shape.points.length; i++) {
    const pt = shape.points[i];
    const pos = createVector(pt.x, pt.y).add(this.center);

    const street = new Street(pos, width, i);
    street.connect(previous);

    if(i === 0) first = street;
    track.push(street);
    previous = street;
  }
  first.connect(previous);
  this.start = first;

  return track;

  // const resolution = shape;
  // const radius = 240;
  // const width = 50;
  // let first = null;
  // let previous = null;
  //
  // for(let angle = 0, i = 0; angle < 2*PI; angle += 2*PI/resolution, i++) {
  //   const pos = createVector(cos(angle), sin(angle)).mult(radius).add(this.center);
  //   const street = new Street(pos, width, i);
  //   street.connect(previous);
  //
  //   if(angle === 0) first = street;
  //   this.track.push(street);
  //   previous = street;
  // }
  // first.connect(previous);
  // this.start = first;
}

RacingTrack.prototype.check_walls = function(vehicle) {
  // Find closest street
  const street = this.find_closest(vehicle);
  return (street.hits_wall(vehicle)); // || street.previous.hits_wall(vehicle) || street.next.hits_wall(vehicle));
}

RacingTrack.prototype.find_closest = function(vehicle) {
  let best_dist = Infinity;
  let best_street = null;

  for(let street of this.track) {
    const dist = fast_distance(vehicle.pos, street.pos);

    if(dist < best_dist) {
      best_dist = dist;
      best_street = street;
    }
  }

  if(best_street) {
    return best_street;
  }

  return null;
}

RacingTrack.prototype.show = function() {
  for(let s of this.track) {
    s.show();
  }


  // Show the outlines of track
  beginShape();
  stroke(color(255, 0, 100, 200))
  strokeWeight(3);
  noFill();

  const first = this.track[0];
  curveVertex(first.previous.bounds.right.x, first.previous.bounds.right.y)
  for(let i = 0; i < this.track.length; i++) {
    const s = this.track[i];
    vertex(s.bounds.right.x, s.bounds.right.y);
  }
  curveVertex(first.bounds.right.x, first.bounds.right.y)
  curveVertex(first.next.bounds.right.x, first.next.bounds.right.y)
  endShape();

  beginShape();
  curveVertex(first.previous.bounds.left.x, first.previous.bounds.left.y)
  for(let i = 0; i < this.track.length; i++) {
    const s = this.track[i];
    curveVertex(s.bounds.left.x, s.bounds.left.y);
  }
  curveVertex(first.bounds.left.x, first.bounds.left.y)
  curveVertex(first.next.bounds.left.x, first.next.bounds.left.y)

  endShape();


  // Draw center of track
  stroke(255);
  strokeWeight(8);
  point(this.center.x, this.center.y);
}


const fast_distance = function(a, b) {
  const dist = abs(b.x - a.x) + abs(b.y - a.y);
  return dist;
}

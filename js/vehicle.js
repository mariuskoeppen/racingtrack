const MAX_ACC = .3;
const MAX_SPEED = 5;

const CROSSOVER = {
  VEC: 'lerp',
  MUTATION_RATE: 0.001,
  NORMALIZE: true,
}

class Vehicle {
  path = [];
  path_index = 0;

  lap = 0;

  lifetime = 0;
  alive = true;
  distance_traveled = 0;
  optimal_path_index = 0;
  fitness_lookup = 0;
  best_vehicle = false;
  children = 0;

  constructor(path, max_acc, generation = 1) {
    this.pos = createVector(track.start.pos.x, track.start.pos.y);
    this.vel = createVector(0, 0);
    this.acc= createVector(0, 0);

    this.max_acc = max_acc || random(0.1, 0.6);
    this.generation = generation;
    this.main_color = color(50, 150, 240, 0.5*255);

    if(!path) {
      this.path = this.create_path(floor(random(10, 1000)));
    } else {
      this.path = path;
    }
  }

  get color() {
    if(this.best_vehicle) return color(50, 150, 240)
    if(!this.alive) return death_color;
    return this.main_color;
  }

  get fitness() {
    return log(this.lifetime+1)/10 + 0.5 * this.distance_traveled + 20 * this.fitness_lookup;
  }
}


Vehicle.prototype.reset = function() {
  this.lifetime = 0;
  this.optimal_path_index = 0;
  this.path_index = 0;
  this.lap = 0;
  this.alive = true;
  this.distance_traveled = 0;
  this.fitness_lookup = 0;
  this.best_vehicle = false;

  this.pos = createVector(track.start.pos.x, track.start.pos.y);
  this.vel = createVector(0, 0);
  this.acc= createVector(0, 0);
}

Vehicle.prototype.steer = function() {
  const force = this.path[this.path_index];
  this.apply_force(force);
  this.path_index++;
  if(this.path_index >= this.path.length-1) this.path_index = 0;
}

Vehicle.prototype.update = function() {
  if(this.alive) {
    this.steer();
    this.move();
    this.live();
    this.check_optimal_path();
    this.lifetime++;
  }
  this.show();
}

Vehicle.prototype.live = function() {
  const hit_wall = (track.check_walls(this));
  if(hit_wall) {
    this.alive = false;
    return;
    // this.increase_fitness(-200/this.lifetime);
  }
  const out_of_bounds = (this.pos.x < 0 || this.pos.x > width || this.pos.y < 0 || this.pos.y > height);
  if (out_of_bounds) {
    this.alive = false;
    this.increase_fitness(-50);
  }
}

Vehicle.prototype.increase_fitness = function(val) {
  this.fitness_lookup += val;
}

Vehicle.prototype.create_path = function(len) {
  let path = [];
  for(let i = 0; i < len; i++) {
    path.push(p5.Vector.random2D());
  }
  return path;
}

Vehicle.prototype.crossover = function(vehicle) {
  // generate probability based on fitness
  const split = this.fitness / (abs(this.fitness) + abs(vehicle.fitness));
  let new_genes = [];
  const len = constrain(floor(lerp(this.path.length, vehicle.path.length, 1-split) + random(-.2*this.path.length, .2*this.path.length)), 10, Infinity);

  for(let i = 0; i < len; i++) {
    let vec = null;

    if(CROSSOVER.VEC === 'lerp') {
      if(this.path[i] && vehicle.path[i]) {
        vec = this.path[i].copy().lerp(vehicle.path[i]);
      } else if(this.path[i] && !vehicle.path[i]) {
        vec = this.path[i];
      } else if(!this.path[i] && vehicle.path[i]) {
        vec = vehicle.path[i];
      } else {
        vec = p5.Vector.random2D();
      }
    } else {
      if(random(1) < split && this.path[i]) {
        vec = this.path[i];
      } else if(vehicle.path[i]) {
        vec = vehicle.path[i];
      } else {
        vec = p5.Vector.random2D();
      }
    }

    if(CROSSOVER.NORMALIZE) {
      vec.normalize();
    }

    new_genes.push(vec);
  }

  // Mutate genes
  for(let i in new_genes) {
    if(random(1) < CROSSOVER.MUTATION_RATE) {
      new_genes[i] = p5.Vector.random2D();
    }
  }

  const v = new Vehicle(new_genes, lerp(this.max_acc, vehicle.max_acc, 1-split), this.generation+1);

  return v;
}

Vehicle.prototype.apply_force = function(force) {
  this.acc.add(force);
  this.acc.limit(MAX_ACC);
}

Vehicle.prototype.move = function() {
  this.vel.add(this.acc).limit(MAX_SPEED)
  this.pos.add(this.vel);
  this.distance_traveled += this.vel.mag();
}

Vehicle.prototype.check_optimal_path = function() {
  // Find the closest street
  const closest_street = track.find_closest(this);
  const highest_index = track.track[track.track.length-1].index;

  const my_ind = this.optimal_path_index;
  const my_ref = my_ind + this.lap * highest_index;
  const street_ind = closest_street.index;
  const street_ref = street_ind + this.lap * highest_index;

  if(street_ref === my_ref + 1) { // I am one street further in right direction
    this.optimal_path_index++;
    this.increase_fitness(2);

    // Check distance to path
    const dist = distance_point_line(this.pos, closest_street.pos, closest_street.direction);
    this.increase_fitness(map(dist, 0, closest_street.width, 0.25, 0));

    if(street_ind === highest_index) {
      this.lap++;
      this.optimal_path_index = 0;
      this.increase_fitness(0.30 * 1.5 * highest_index);
    }
  } else if(street_ref === my_ref) {
    // Do nothing
  } else {
    this.increase_fitness(-1);
  }

}

Vehicle.prototype.show = function() {
  push();
  translate(this.pos.x, this.pos.y);
  rotate(this.vel.heading() - PI/2);
  noStroke();
  let col = this.color;
  if(this.best_vehicle) {
    // Draw circle
    stroke(color(0, 230, 0, .66*255));
    strokeWeight(1);
    noFill()
    circle(0, 4, 30);
  }
  fill(col)
  beginShape();
  vertex(0, 12);
  vertex(4, -3);
  vertex(0, -4)
  vertex(-4, -3);
  endShape();
  point(0, 0)
  pop();
}

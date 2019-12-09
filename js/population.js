class Population {
  pop = [];
  dynasty = 1;


  constructor(size) {
    this.create_pop(size);
    this.size = size;
    this.timestamp = millis();
  }

  get best_vehicle() {
    const best = this.pop.reduce((acc, curr) => {
      curr.best_vehicle = false;
      if(curr.fitness > acc.fitness) {
        return curr;
      }
      return acc;
    }, this.pop[0]);
    best.best_vehicle = true;
    return best;
  }

  get best_fitness() {
    return this.best_vehicle.fitness;
  }

  get average_fitness() {
    const avg = this.pop.reduce((acc, curr) => acc + curr.fitness/this.pop.length, 0);
    return avg;
  }

  get survivors() {
    const surv = this.pop.reduce((acc, curr) => {
      if(curr.alive) return acc + 1;
      return acc;
    }, 0)
    return surv;
  }

  get time_running() {
    return millis() - this.timestamp;
  }
}



Population.prototype.pick_random = function() {
	const total_fitness = this.pop.reduce((acc, curr) => acc + curr.fitness, 0);
  // const total_fitness = this.best_fitness;
	let r_ind = 0;
	let r_num = 0;

	do {
		r_ind = floor(random(this.pop.length));
		r_num = random(1);
	} while(r_num > this.pop[r_ind].fitness/total_fitness);
	return this.pop[r_ind];
}

Population.prototype.create_pop = function(size) {
  this.pop = [];
  for(let i = 0; i < size; i++) {
    this.pop.push(new Vehicle());
  }
}

Population.prototype.recreate_pop = function() {
  const len = this.pop.length;
  this.pop.sort((a, b) => b.fitness - a.fitness);
  // Filter out the worst 10% of the population to exclude from reproduction
  this.pop.splice(len - 0.1 * len, len);
  // Save the best to directly pass on to the next generation
  const best = this.pop.slice(0, 0.1 * len);


  let children = [];

  for(let i = 0; i < this.pop.length; i++) {
    // Pick two random parents
    const parent1 = this.pick_random();
    const parent2 = this.pick_random();

    const child = parent1.crossover(parent2);
    parent1.children++;
    parent2.children++;
    children.push(child);
  }

  best.forEach((v) => v.reset());
  this.pop = [...best, ...children];
  this.dynasty++;
}

Population.prototype.update = function() {
  this.show();

  // Check if population has died out
  const red_pop = this.pop.filter((v) => v.alive);
  if(red_pop.length <= 0) {
    this.recreate_pop(this.pop.length);
  }
}

Population.prototype.show = function() {
  for(let v of this.pop) {
    v.update();
  }
}

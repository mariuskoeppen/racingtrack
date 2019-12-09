class Shape {
  constructor(options) {
    const {points, formula, steps, radius, name} = options;
    if(formula) {
      this.formula = formula;
      this.points = this.calc_points(formula, radius, steps);
    } else if(points) {
      this.points = points;
    }

    this.name = name || 'no name';
  }

  calc_points(formula, radius = 1, steps = 25) {
    let points = [];

    for(let angle = 0; angle < 2*PI; angle += 2*PI / steps) {
      let pt = formula(angle, radius);
      points.push(pt);
    }

    return points;
  }
}

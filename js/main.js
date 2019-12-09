let SPEED = 100;

let track;
let population;
let vue;
let shapes;
let selected_shape = 0;
let death_color;
let framerates = [];

function setup() {
  let canvas = createCanvas(600, 600);

  death_color = color(240, 0, 50, 0.3*255);

  shapes = create_shapes(200, 30);
  initialize_all(shapes[0], 100);

  vue = new Vue({
    el: '#app',
    data: {
      population,
      available_shapes: shapes,
      selected_shape,
      framerates,
    },
    computed: {
      average_framerate: function() {
        const len = this.framerates.length;
        const ref = 2 * ceil(this.framerates[0]) || 30;

        if(len > ref) {
          this.framerates.splice(ref);
        }

        return round(this.framerates.reduce((acc, curr) => acc + curr / len, 0))
      },
    },
    methods: {
      shape_switched: function() {
        initialize_all(shapes[this.selected_shape], population.size);
        this.population = population;
      }
    }
  });


  canvas.parent('canvas');
}

function draw() {
  background(51);

  framerates.unshift(frameRate());


  track.show();
  population.update();
}



const initialize_all = function(shape, pop_size = 10) {
  if(!(shape instanceof Shape)) return console.warn('Need to pass shape as first arg. ');

  track = new RacingTrack(createVector(width/2, height/2), shape);
  population = new Population(pop_size);
}



const create_shapes = function(radius = 1, accuracy = 25) {
  const shps = [];

  const circle = new Shape({
    formula: function(a, r) {
      const x = r*cos(a);
      const y = r*sin(a);
      return {x, y};
    },
    steps: accuracy,
    radius: radius,
    name: 'circle',
  });

  const eight = new Shape({
    formula: function(a, r) {
      const x = r*sin(a)*cos(a);
      const y = r*sin(a);
      return {x, y};
    },
    steps: accuracy,
    radius: radius,
    name: 'eight'
  });


  // const inf = new Shape({
  //   formula: function(a, r) {
  //     const x = r*sin(a);
  //     const y = r*sin(a)*cos(a);
  //     return {x, y};
  //   },
  //   steps: accuracy,
  //   radius: radius,
  //   name: 'infinity'
  // });

  const rect = new Shape({
    formula: function(a, r) {
      const x = (1 + 0.3*sin(a*2))*r*cos(a);
      const y = r*sin(a);
      return {x, y};
    },
    steps: accuracy,
    radius: radius,
    name: 'edges',
  });

  const egg = new Shape({
    formula: function(a, r) {
      const x = (1 + 0.3*sin(a))*r*cos(a);
      const y = (1 + 0.25*sin(a/2))*r*sin(a);
      return {x, y};
    },
    steps: accuracy,
    radius: radius,
    name: 'egg',
    unicode: '1F95A',
  });



  shps.push(circle, eight, rect, egg);

  return shps;
}

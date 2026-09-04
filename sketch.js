let seed = 8081;
let n = 8 + seed % 8; // 9
let p = 3 + seed % 4; // 4
let d = 4 + seed % 3; // 6

let palette = []; // colours
let shapes = [];

function nextRandom(x) {
  x = (Math.imul(1103515245, x) + 12345) & 0x7fffffff;//السطر هاد هاي من تشات كان عندي اشكال حمرة ب مكان عشوائي حكالي حط هاي بدالها بزبط
  
  return x; //random معادلة ال 
}

let x = seed ; //random 

function setup() {
  createCanvas(400, 400);

  for (let i = 0; i < p; i++) {
    x = nextRandom(x);
    let r = x % 256;

    x = nextRandom(x);
    let g = x % 256;

    x = nextRandom(x);
    let b = x % 256;

    palette.push(color(r, g, b , 180));
  }

  for (let i = 0; i < n; i++) {

    x = nextRandom(x); //shapes
    let index = x % 3;

    let shape;

    if (index == 0) {
      shape = "rectangle";
    } else if (index == 1) {
      shape = "circle";
    } else {
      shape = "triangle";
    }

    x = nextRandom(x);//random size for each shape 
    let sx = x % width;

    x = nextRandom(x);
    let sy = x % height;

    x = nextRandom(x);
    let size = 30 + (x % 70);

    x = nextRandom(x);
    let colorNumber = x % p; //filling colour in each shape 

    shapes.push({
      shape: shape,
      x: sx,
      y: sy,
      size: size,
      colorNumber: colorNumber
    });
  }
}

function draw() {
  background(220);

  noStroke();

  for (let i = 0; i < shapes.length; i++) {
    let s = shapes[i];

    fill(palette[s.colorNumber]);

    if (s.shape == "rectangle") {
      rect(s.x, s.y, s.size, s.size);
    } 
    else if (s.shape == "circle") {
      circle(s.x, s.y, s.size);
    } 
    else if (s.shape == "triangle") {
      triangle(
        s.x, s.y - s.size / 2,
        s.x - s.size / 2, s.y + s.size / 2,
        s.x + s.size / 2, s.y + s.size / 2
      );
    }
  }

  fill(0);
  textSize(16); //size 
  textAlign(LEFT, TOP); //place 

  text("Seed: " + seed, 10, 10); //the text 
  text("n: " + n, 10, 30);
  text("p: " + p, 10, 50);
  text("d: " + d, 10, 70);
}

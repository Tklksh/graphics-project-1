let seed = 8081;

let n = 8 + (seed % 8); // 9
let p = 3 + (seed % 4); // 4
let d = 4 + (seed % 3); // 6

let palette = []; //colours
let shapes = [];

let currentModule = 0;
let triangleCount = 0;

let transformOrder = 0;

function nextRandom(x) {

  x = (Math.imul(1103515245, x) + 12345) & 0x7fffffff; //السطر هاد هاي من تشات كان عندي اشكال حمرة ب مكان عشوائي حكالي حط هاي بدالها بزبط

  return x; //random معادلة ال
}

let x = seed; //random

function setup() {

  createCanvas(400, 400);

  for (let i = 0; i < p; i++) {

    x = nextRandom(x);
    let r = x % 256;

    x = nextRandom(x);
    let g = x % 256;

    x = nextRandom(x);
    let b = x % 256;

    palette.push(color(r, g, b, 180));
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

    x = nextRandom(x); //random size for each shape
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
      colorNumber: colorNumber,

    });
  }
}

function draw() {

  background(220);

  //Menu
  if (currentModule == 0) {

    fill(0);
    textAlign(LEFT, TOP);

    textSize(22);
    text("SceneForge Menu", 30, 30);

    textSize(16);
    text("1 - Shapes & Colour", 30, 80);
    text("2 - Sierpinski", 30, 110);
    text("3 - Transformations", 30, 140);
    text("4 - 3D Camera", 30, 170);
    text("5 - Measure & Compare", 30, 200);

    textSize(14);
    text("Seed: " + seed, 30, 250);
    text("n: " + n + "  p: " + p + "  d: " + d, 30, 275);
  }

  //Module 1
  else if (currentModule == 1) {

    noStroke();

    for (let i = 0; i < shapes.length; i++) {

      let s = shapes[i];

      fill(palette[s.colorNumber]);

      if (s.shape == "rectangle") {

        rect(s.x, s.y, s.size, s.size);

      } else if (s.shape == "circle") {

        circle(s.x, s.y, s.size);

      } else if (s.shape == "triangle") {

        triangle(
          s.x,
          s.y - s.size / 2,
          s.x - s.size / 2,
          s.y + s.size / 2,
          s.x + s.size / 2,
          s.y + s.size / 2
        );
      }
    }

    fill(0);
    textSize(16);
    textAlign(LEFT, TOP);

    text("Seed: " + seed, 10, 10);
    text("n: " + n, 10, 30);
    text("p: " + p, 10, 50);
    text("d: " + d, 10, 70);
  }

  //Module 2
  else if (currentModule == 2) {

    background(255);

    triangleCount = 0;

    sierpinski(
      200, 50,
      50, 350,
      350, 350,
      d,
      0
    );

    noStroke();
    fill(0);

    textSize(20);
    textAlign(LEFT, TOP);

    text("Sierpinski", 10, 10);

    textSize(16);
    text("Depth: " + d, 10, 35);
    text("Triangles: " + triangleCount, 10, 55);
  }

  //Module 3
  else if (currentModule == 3) {

    noStroke();

    let transformX = seed;

    for (let i = 0; i < shapes.length; i++) {

      let s = shapes[i];

      //rotation from seed
      transformX = nextRandom(transformX);
      let angle = radians(transformX % 360);

      //scale from seed
      transformX = nextRandom(transformX);
      let scaleAmount = 0.7 + (transformX % 61) / 100;

      //movement distance from seed
      transformX = nextRandom(transformX);
      let moveAmount = 10 + (transformX % 31);

      //movement speed from seed
      transformX = nextRandom(transformX);
      let speed = 0.01 + (transformX % 11) / 1000;

      //starting movement angle from seed
      transformX = nextRandom(transformX);
      let phase = radians(transformX % 360);

      let moveX = 0;
      let moveY = 0;
      let movingAngle = angle;

      //Bonus: animate one shape only
      if (i == 0) {

        moveX = sin(frameCount * speed + phase) * moveAmount;

        moveY = cos(frameCount * speed + phase) * moveAmount;

        movingAngle = angle + frameCount * speed;
      }

      push();

      //normal order
      if (transformOrder == 0) {

        translate(
          s.x + moveX,
          s.y + moveY
        );

        rotate(movingAngle);

        scale(scaleAmount);
      }

      //different order
      else {

        rotate(movingAngle);

        translate(
          s.x + moveX,
          s.y + moveY
        );

        scale(scaleAmount);
      }

      fill(palette[s.colorNumber]);

      if (s.shape == "rectangle") {

        rectMode(CENTER);

        rect(
          0,
          0,
          s.size,
          s.size
        );

      } else if (s.shape == "circle") {

        circle(
          0,
          0,
          s.size
        );

      } else if (s.shape == "triangle") {

        triangle(
          0,
          -s.size / 2,

          -s.size / 2,
          s.size / 2,

          s.size / 2,
          s.size / 2
        );
      }

      pop();
    }

    noStroke();
    fill(0);

    textSize(20);
    textAlign(LEFT, TOP);

    text("Transformations", 10, 10);

    textSize(14);

    if (transformOrder == 0) {

      text("Order: Translate -> Rotate -> Scale", 10, 35);

    } else {

      text("Order: Rotate -> Translate -> Scale", 10, 35);
    }

    text("Press O to change the order", 10, 55);
    text("Bonus: first shape animated", 10, 75);
  }

  //Modules the left ones
  else {

    fill(0);
    textSize(20);
    textAlign(CENTER, CENTER);

    text("Not implemented yet", width / 2, height / 2);
  }
}

function sierpinski(x1, y1, x2, y2, x3, y3, depth, level) {

  // colour by recursion level
  let c = palette[level % p];

  stroke(
    red(c) * 0.55,
    green(c) * 0.55,
    blue(c) * 0.55
  );

  strokeWeight(max(0.7, 2.2 - level * 0.2));

  noFill();

  triangle(x1, y1, x2, y2, x3, y3);

  // Base case
  if (depth == 0) {

    noStroke();

    fill(
      red(c) * 0.75,
      green(c) * 0.75,
      blue(c) * 0.75,
      180
    );

    triangle(x1, y1, x2, y2, x3, y3);

    triangleCount++;

    return;
  }

  // midpoint between point 1 and point 2
  let midABx = (x1 + x2) / 2;
  let midABy = (y1 + y2) / 2;

  // midpoint between point 1 and point 3
  let midACx = (x1 + x3) / 2;
  let midACy = (y1 + y3) / 2;

  // midpoint between point 2 and point 3
  let midBCx = (x2 + x3) / 2;
  let midBCy = (y2 + y3) / 2;

  // first small triangle
  sierpinski(
    x1, y1,
    midABx, midABy,
    midACx, midACy,
    depth - 1,
    level + 1
  );

  // second small triangle
  sierpinski(
    midABx, midABy,
    x2, y2,
    midBCx, midBCy,
    depth - 1,
    level + 1
  );

  // third small triangle
  sierpinski(
    midACx, midACy,
    midBCx, midBCy,
    x3, y3,
    depth - 1,
    level + 1
  );
}

function keyPressed() {

  if (key == "1") {

    currentModule = 1;

  } else if (key == "2") {

    currentModule = 2;

  } else if (key == "3") {

    currentModule = 3;

  } else if (key == "4") {

    currentModule = 4;

  } else if (key == "5") {

    currentModule = 5;

  } else if (key == "0") {

    currentModule = 0;

  } else if (key == "o" || key == "O") {

    if (currentModule == 3) {

      if (transformOrder == 0) {

        transformOrder = 1;

      } else {

        transformOrder = 0;
      }
    }
  }
}
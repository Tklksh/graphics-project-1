let seed = 8081;

let n = 8 + (seed % 8); //9
let p = 3 + (seed % 4); //4
let d = 4 + (seed % 3); //6

let palette = []; //colours
let shapes = [];

let currentModule = 0;

let triangleCount = 0;

let hud;

function nextRandom(x) {

  x = (Math.imul(1103515245, x) + 12345) & 0x7fffffff; //السطر هاد هاي من تشات كان عندي اشكال حمرة ب مكان عشوائي حكالي حط هاي بدالها بزبط

  return x; //random معادلة ال

}

let x = seed; //random

function setup() {

  createCanvas(400, 400, WEBGL);

  //2D layer for text
  hud = createGraphics(400, 400);

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

  hud.clear();

  //return old 2D origin for Menu and Modules 1-3
  if (currentModule != 4) {

    camera();

    perspective();

    translate(-width / 2, -height / 2);

  }

  //Menu
  if (currentModule == 0) {

    hud.fill(0);

    hud.textAlign(LEFT, TOP);

    hud.textSize(22);

    hud.text("SceneForge Menu", 30, 30);

    hud.textSize(16);

    hud.text("1 - Shapes & Colour", 30, 80);

    hud.text("2 - Sierpinski", 30, 110);

    hud.text("3 - Transformations", 30, 140);

    hud.text("4 - 3D Camera", 30, 170);

    hud.text("5 - Measure & Compare", 30, 200);

    hud.textSize(14);

    hud.text("Seed: " + seed, 30, 250);

    hud.text("n: " + n + "  p: " + p + "  d: " + d, 30, 275);

  }

  //Module 1
  else if (currentModule == 1) {

    rectMode(CORNER);

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

    hud.fill(0);

    hud.textSize(16);

    hud.textAlign(LEFT, TOP);

    hud.text("Seed: " + seed, 10, 10);

    hud.text("n: " + n, 10, 30);

    hud.text("p: " + p, 10, 50);

    hud.text("d: " + d, 10, 70);

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

    hud.fill(0);

    hud.textSize(20);

    hud.textAlign(LEFT, TOP);

    hud.text("Sierpinski", 10, 10);

    hud.textSize(16);

    hud.text("Depth: " + d, 10, 35);

    hud.text("Triangles: " + triangleCount, 10, 55);

  }

  //Module 3
  else if (currentModule == 3) {

    noStroke();

    let transformX = seed;

    for (let i = 0; i < shapes.length; i++) {

      let s = shapes[i];

      //rotation from seed
      transformX = nextRandom(transformX);

      let angle = radians((transformX % 61) - 30);

      //scale from seed
      transformX = nextRandom(transformX);

      let scaleAmount = 0.7 + (transformX % 61) / 100;

      //Bonus: animate one shape with frameCount
      if (i == 0) {

        angle = angle + frameCount * 0.01;

      }

      push();

      //change the order for the first shape while mouse is pressed
      if (i == 0 && mouseIsPressed) {

        rotate(angle);

        translate(s.x, s.y);

      } else {

        translate(s.x, s.y);

        rotate(angle);

      }

      scale(scaleAmount);

      fill(palette[s.colorNumber]);

      //draw shape at origin
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

    hud.fill(0);

    hud.textSize(20);

    hud.textAlign(LEFT, TOP);

    hud.text("Transformations", 10, 10);

    hud.textSize(14);

    hud.text("Translate -> Rotate -> Scale", 10, 35);

    hud.text("Hold the mouse button to see the order change", 10, 55);

  }

  //Module 4
  else if (currentModule == 4) {

    //Bonus: orbit camera with sin and cos
    let cameraAngle = frameCount * 0.01;

    let eyeX = cos(cameraAngle) * 500;

    let eyeY = 200;

    let eyeZ = sin(cameraAngle) * 500;

    //camera: eye,target,up
    camera(

      eyeX,
      eyeY,
      eyeZ,

      0,
      0,
      0,

      0,
      1,
      0

    );

    //Perspective view
    if (!mouseIsPressed) {

      perspective(

        PI / 3,

        width / height,

        1,

        2000

      );

    }

    //Orthographic view
    else {

      ortho(

        -250,

        250,

        -250,

        250,

        1,

        2000

      );

    }

    //lights for the 3D scene
    ambientLight(120);

    directionalLight(

      255,
      255,
      255,

      -1,
      1,
      -1

    );

    //draw the same seeded scene with depth
    let depthX = seed;

    for (let i = 0; i < shapes.length; i++) {

      let s = shapes[i];

      depthX = nextRandom(depthX);

      //random depth from the seed
      let z = -150 + (depthX % 301);

      push();

      //WEBGL origin is in the centre
      translate(

        s.x - width / 2,

        s.y - height / 2,

        z

      );

      noStroke();

      ambientMaterial(palette[s.colorNumber]);

      if (s.shape == "rectangle") {

        box(

          s.size,

          s.size,

          30

        );

      } else if (s.shape == "circle") {

        sphere(

          s.size / 2

        );

      } else if (s.shape == "triangle") {

        cone(

          s.size / 2,

          s.size

        );

      }

      pop();

    }

    hud.fill(0);

    hud.textSize(20);

    hud.textAlign(LEFT, TOP);

    hud.text("3D Camera", 10, 10);

    hud.textSize(14);

    if (!mouseIsPressed) {

      hud.text("Perspective View", 10, 35);

      hud.text("Far objects look smaller", 10, 55);

      hud.text("Hold the mouse for Orthographic View", 10, 75);

    } else {

      hud.text("Orthographic View", 10, 35);

      hud.text("Far objects stay the same size", 10, 55);

      hud.text("Release the mouse for Perspective View", 10, 75);

    }

    hud.text("Bonus: camera orbit with sin() and cos()", 10, 95);

  }

  //Modules the left ones
  else {

    hud.fill(0);

    hud.textSize(20);

    hud.textAlign(CENTER, CENTER);

    hud.text("Not implemented yet", width / 2, height / 2);

  }

  //show 2D text over WEBGL
  camera();

  ortho(

    -width / 2,

    width / 2,

    -height / 2,

    height / 2,

    -1000,

    1000

  );

  resetMatrix();

  imageMode(CORNER);

  image(

    hud,

    -width / 2,

    -height / 2

  );

}

function sierpinski(x1, y1, x2, y2, x3, y3, depth, level) {

  //colour by recursion level
  let c = palette[level % p];

  stroke(

    red(c) * 0.55,

    green(c) * 0.55,

    blue(c) * 0.55

  );

  strokeWeight(max(0.7, 2.2 - level * 0.2));

  noFill();

  triangle(x1, y1, x2, y2, x3, y3);

  //Base case
  if (depth == 0) {

    noStroke();

    fill(

      red(c) * 0.75,

      green(c) * 0.75,

      blue(c) * 0.75,

      180

    );

    triangle(

      x1,
      y1,

      x2,
      y2,

      x3,
      y3

    );

    triangleCount++;

    return;

  }

  //midpoint between point 1 and point 2
  let midABx = (x1 + x2) / 2;

  let midABy = (y1 + y2) / 2;

  //midpoint between point 1 and point 3
  let midACx = (x1 + x3) / 2;

  let midACy = (y1 + y3) / 2;

  //midpoint between point 2 and point 3
  let midBCx = (x2 + x3) / 2;

  let midBCy = (y2 + y3) / 2;

  //first small triangle
  sierpinski(

    x1,
    y1,

    midABx,
    midABy,

    midACx,
    midACy,

    depth - 1,

    level + 1

  );

  //second small triangle
  sierpinski(

    midABx,
    midABy,

    x2,
    y2,

    midBCx,
    midBCy,

    depth - 1,

    level + 1

  );

  //third small triangle
  sierpinski(

    midACx,
    midACy,

    midBCx,
    midBCy,

    x3,
    y3,

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

  }

}
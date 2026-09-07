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

  //make palette
  for (let i = 0; i < p; i++) {

    x = nextRandom(x);
    let r = x % 256;

    x = nextRandom(x);
    let g = x % 256;

    x = nextRandom(x);
    let b = x % 256;

    palette.push(color(r, g, b, 180));
  }

  //make shapes
  for (let i = 0; i < n; i++) {

    x = nextRandom(x);
    let index = x % 3;

    let shape;

    if (index == 0) {
      shape = "rectangle";
    } else if (index == 1) {
      shape = "circle";
    } else {
      shape = "triangle";
    }

    x = nextRandom(x);
    let sx = x % width;

    x = nextRandom(x);
    let sy = x % height;

    x = nextRandom(x);
    let size = 30 + (x % 70);

    x = nextRandom(x);
    let colorNumber = x % p;

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
  hud.clear();

  //return old 2D origin
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
    hud.textAlign(LEFT, TOP);
    hud.textSize(16);

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
      d, 0
    );

    hud.fill(0);
    hud.textAlign(LEFT, TOP);

    hud.textSize(20);
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

      //Bonus
      if (i == 0) {
        angle = angle + frameCount * 0.01;
      }

      push();

      //change order with mouse
      if (i == 0 && mouseIsPressed) {
        rotate(angle);
        translate(s.x, s.y);
      } else {
        translate(s.x, s.y);
        rotate(angle);
      }

      scale(scaleAmount);

      fill(palette[s.colorNumber]);

      if (s.shape == "rectangle") {

        rectMode(CENTER);
        rect(0, 0, s.size, s.size);

      } else if (s.shape == "circle") {

        circle(0, 0, s.size);

      } else if (s.shape == "triangle") {

        triangle(
          0, -s.size / 2,
          -s.size / 2, s.size / 2,
          s.size / 2, s.size / 2
        );
      }

      pop();
    }

    hud.fill(0);
    hud.textAlign(LEFT, TOP);

    hud.textSize(20);
    hud.text("Transformations", 10, 10);

    hud.textSize(14);
    hud.text("Translate -> Rotate -> Scale", 10, 35);
    hud.text("Hold the mouse button to see the order change", 10, 55);
  }

  //Module 4
  else if (currentModule == 4) {

    //Bonus: orbit camera
    let cameraAngle = frameCount * 0.01;

    let eyeX = cos(cameraAngle) * 500;
    let eyeY = 200;
    let eyeZ = sin(cameraAngle) * 500;

    camera(
      eyeX, eyeY, eyeZ,
      0, 0, 0,
      0, 1, 0
    );

    //Perspective
    if (!mouseIsPressed) {

      perspective(
        PI / 3,
        width / height,
        1,
        2000
      );

    }

    //Orthographic
    else {

      ortho(
        -250, 250,
        -250, 250,
        1, 2000
      );
    }

    ambientLight(120);
    directionalLight(255, 255, 255, -1, 1, -1);

    let depthX = seed;

    for (let i = 0; i < shapes.length; i++) {

      let s = shapes[i];

      depthX = nextRandom(depthX);
      let z = -150 + (depthX % 301);

      push();

      translate(
        s.x - width / 2,
        s.y - height / 2,
        z
      );

      noStroke();
      ambientMaterial(palette[s.colorNumber]);

      if (s.shape == "rectangle") {

        box(s.size, s.size, 30);

      } else if (s.shape == "circle") {

        sphere(s.size / 2);

      } else if (s.shape == "triangle") {

        cone(s.size / 2, s.size);
      }

      pop();
    }

    hud.fill(0);
    hud.textAlign(LEFT, TOP);

    hud.textSize(20);
    hud.text("3D Camera", 10, 10);

    hud.textSize(14);

    if (!mouseIsPressed) {

      hud.text("Perspective View", 10, 35);
      hud.text("Far objects look smaller", 10, 55);
      hud.text("Hold mouse for Orthographic View", 10, 75);

    } else {

      hud.text("Orthographic View", 10, 35);
      hud.text("Far objects stay the same size", 10, 55);
      hud.text("Release mouse for Perspective View", 10, 75);
    }

    hud.text("Bonus: camera orbit with sin() and cos()", 10, 95);
  }

  //Module 5
  else if (currentModule == 5) {

    if (!mouseIsPressed) {

      showMeasurements();

    } else if (mouseX < width / 2) {

      showFractalExperiment();

    } else {

      showShapeExperiment();

    }
  }

  //show HUD
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
  image(hud, -width / 2, -height / 2);
}


//Sierpinski
function sierpinski(x1, y1, x2, y2, x3, y3, depth, level) {

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

    triangle(x1, y1, x2, y2, x3, y3);

    triangleCount++;

    return;
  }

  let midABx = (x1 + x2) / 2;
  let midABy = (y1 + y2) / 2;

  let midACx = (x1 + x3) / 2;
  let midACy = (y1 + y3) / 2;

  let midBCx = (x2 + x3) / 2;
  let midBCy = (y2 + y3) / 2;

  sierpinski(
    x1, y1,
    midABx, midABy,
    midACx, midACy,
    depth - 1,
    level + 1
  );

  sierpinski(
    midABx, midABy,
    x2, y2,
    midBCx, midBCy,
    depth - 1,
    level + 1
  );

  sierpinski(
    midACx, midACy,
    midBCx, midBCy,
    x3, y3,
    depth - 1,
    level + 1
  );
}


//Module 5 measurements
function showMeasurements() {

  let shapeCount = countShapes(n);
  let fractalCount = countTriangles(d);
  let transformCount = countTransforms(n);
  let depthCount = measureDepth(d);

  hud.fill(0);
  hud.textAlign(LEFT, TOP);

  hud.textSize(19);
  hud.text("Measure & Compare", 15, 10);

  hud.textSize(9);
  hud.text("Hold left half: Fractal | right half: Shapes", 150, 15);

  hud.textSize(11);

  hud.text(
    "1. Shapes drawn per frame\n" +
    "Input: n = " + n + " | Basic op: draw one shape\n" +
    "Measured: " + shapeCount + " | C(n) = n = " + shapeCount + " | O(n)",
    15,
    50
  );

  hud.text(
    "2. Fractal triangles\n" +
    "Input: d = " + d + " | Basic op: draw one triangle\n" +
    "Measured: " + fractalCount + " | C(d) = 3^d = " + fractalCount + " | O(3^d)",
    15,
    125
  );

  hud.text(
    "3. Transforms applied\n" +
    "Input: n = " + n + " | Basic op: one transform\n" +
    "Measured: " + transformCount + " | C(n) = 3n = " + transformCount + " | O(n)",
    15,
    200
  );

  hud.text(
    "4. Fractal recursion depth\n" +
    "Input: d = " + d + " | Basic op: one recursion level\n" +
    "Measured: " + depthCount + " | C(d) = d = " + depthCount + " | O(d)",
    15,
    275
  );
}


//Fractal experiment
function showFractalExperiment() {

  let depths = [2, 3, 4, 5, 6];
  let values = [];

  let table = "Depth | Run1 | Run2 | Run3 | Avg | Ratio\n";

  let previous = 0;

  for (let i = 0; i < depths.length; i++) {

    let depth = depths[i];

    let run1 = countTriangles(depth);
    let run2 = countTriangles(depth);
    let run3 = countTriangles(depth);

    let average = (run1 + run2 + run3) / 3;

    values.push(average);

    let ratio = "-";

    if (i > 0) {
      ratio = (average / previous).toFixed(2);
    }

    table +=
      depth + "       | " +
      run1 + "     | " +
      run2 + "     | " +
      run3 + "     | " +
      average + " | " +
      ratio + "\n";

    previous = average;
  }

  hud.fill(0);
  hud.textAlign(LEFT, TOP);

  hud.textSize(18);
  hud.text("Fractal Experiment", 15, 10);

  hud.textSize(10);
  hud.text(table, 15, 45);

  drawPlot(
    depths,
    values,
    729,
    "Plot 1: Triangles vs Depth",
    "Depth",
    "Triangles"
  );
}


//Shape experiment
function showShapeExperiment() {

  let sizes = [5, 10, 15, 20, 25];
  let values = [];

  let table = "Scene | Run1 | Run2 | Run3 | Average\n";

  for (let i = 0; i < sizes.length; i++) {

    let size = sizes[i];

    let run1 = countShapes(size);
    let run2 = countShapes(size);
    let run3 = countShapes(size);

    let average = (run1 + run2 + run3) / 3;

    values.push(average);

    table +=
      size + "       | " +
      run1 + "     | " +
      run2 + "     | " +
      run3 + "     | " +
      average + "\n";
  }

  hud.fill(0);
  hud.textAlign(LEFT, TOP);

  hud.textSize(18);
  hud.text("Shape Experiment", 15, 10);

  hud.textSize(10);
  hud.text(table, 15, 45);

  drawPlot(
    sizes,
    values,
    25,
    "Plot 2: Shapes vs Scene Size",
    "Scene Size",
    "Shapes"
  );
}


//count final fractal triangles
function countTriangles(depth) {

  if (depth == 0) {
    return 1;
  }

  return (
    countTriangles(depth - 1) +
    countTriangles(depth - 1) +
    countTriangles(depth - 1)
  );
}


//count shapes
function countShapes(size) {

  let count = 0;

  for (let i = 0; i < size; i++) {
    count++;
  }

  return count;
}


//count transforms
function countTransforms(size) {

  let count = 0;

  for (let i = 0; i < size; i++) {
    count += 3;
  }

  return count;
}


//measure recursion depth
function measureDepth(depth) {

  if (depth == 0) {
    return 0;
  }

  return 1 + measureDepth(depth - 1);
}


//one plot function for both plots
function drawPlot(xValues, yValues, maxY, title, xName, yName) {

  let left = 50;
  let right = 365;
  let top = 245;
  let bottom = 350;

  hud.fill(0);
  hud.noStroke();

  hud.textSize(13);
  hud.text(title, 15, 215);

  //axes
  hud.stroke(0);
  hud.strokeWeight(1);

  hud.line(left, top, left, bottom);
  hud.line(left, bottom, right, bottom);

  hud.noStroke();
  hud.fill(0);

  hud.textSize(9);

  hud.text(yName, 5, 235);
  hud.text(xName, 320, 365);

  //plot
  for (let i = 0; i < xValues.length; i++) {

    let px = map(
      xValues[i],
      xValues[0],
      xValues[xValues.length - 1],
      left,
      right
    );

    let py = map(
      yValues[i],
      0,
      maxY,
      bottom,
      top
    );

    //connect points
    if (i > 0) {

      let oldX = map(
        xValues[i - 1],
        xValues[0],
        xValues[xValues.length - 1],
        left,
        right
      );

      let oldY = map(
        yValues[i - 1],
        0,
        maxY,
        bottom,
        top
      );

      hud.stroke(0);
      hud.line(oldX, oldY, px, py);
    }

    hud.noStroke();
    hud.fill(0);

    hud.circle(px, py, 7);

    hud.text(
      xValues[i],
      px - 4,
      bottom + 5
    );
  }
}


function keyPressed() {

  if (key == "0") {
    currentModule = 0;
  } else if (key == "1") {
    currentModule = 1;
  } else if (key == "2") {
    currentModule = 2;
  } else if (key == "3") {
    currentModule = 3;
  } else if (key == "4") {
    currentModule = 4;
  } else if (key == "5") {
    currentModule = 5;
  }
}
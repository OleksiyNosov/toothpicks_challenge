let toothpickWidth = 0.5;
let toothpickHeight = toothpickWidth * 5;
let w = toothpickWidth;
let h = toothpickHeight;

let toothpickHalfWidth = toothpickWidth / 2;
let toothpickHalfHeight = toothpickHeight / 2;
let w_2 = toothpickHalfWidth;
let h_2 = toothpickHalfHeight;

let toothpickPositions = new Map([["verical", 0], ["horizontal", 1]])
let startingCoords = {x: 500, y: 500};
let usedCoords = new Set();

function nextToothpickPosition(orientation) {
  return orientation == "verical" ? "horizontal" : "verical";
}

function createToothpickUsedCoords(centerCoords, orientation) {
  let x = centerCoords.x;
  let y = centerCoords.y;
  let usedCoords = [];

  if (toothpickPositions.get(orientation) == toothpickPositions.get("horizontal")) {
    usedCoords = [
      centerCoords,
      {x: (x + w_2 - h_2), y: y},
      {x: (x - w_2 + h_2), y: y}
    ]
  } else {
    usedCoords = [
      centerCoords,
      {x: x, y: (y + h_2 - w_2)},
      {x: x, y: (y - h_2 + w_2)}
    ]
  }

  return usedCoords;
}

function createRenderData(centerCoords, orientation) {
  let x = centerCoords.x;
  let y = centerCoords.y;
  let renderData = {}

  if (toothpickPositions.get(orientation) == toothpickPositions.get("horizontal")) {
    renderData = {
      x: (x - h_2),
      y: (y - w_2),
      width: h,
      height: w
    }
  } else {
    renderData = {
      x: (x - w_2),
      y: (y - h_2),
      width: w,
      height: h
    }
  }

  return renderData;
}

function createNeighborCoords(centerCoords, orientation) {
  let x = centerCoords.x;
  let y = centerCoords.y;
  let coords = [];

  if (toothpickPositions.get(orientation) == toothpickPositions.get("horizontal")) {
    coords = [
      {x: (x + w_2 + h_2), y: y},
      {x: (x - w_2 - h_2), y: y}
    ];
  } else {
    coords = [
      {x: x, y: (y + h_2 + w_2)},
      {x: x, y: (y - h_2 - w_2)}
    ];
  }

  return coords;
}

function createToothpick(centerCoords, orientation) {
  toothpick = {
    orientation:       orientation,
    centerCoords:   centerCoords,
    usedCoords:     createToothpickUsedCoords(centerCoords, orientation),
    neighborCoords: createNeighborCoords(centerCoords, orientation),
    renderData:     createRenderData(centerCoords, orientation)
  };

  addUsedCoords(centerCoords);
  toothpick.usedCoords.forEach(c => addUsedCoords(c));

  return toothpick;
}

function coordsToString(coords) {
  return `(${coords.x};${coords.y})`;
}

function addUsedCoords(coords) {
  usedCoords.add(coordsToString(coords));
}

function isUsedCoords(coords) {
  return usedCoords.has(coordsToString(coords));
}

function isSqueezed(coords) {
  let counter =
    isUsedCoords({x: coords.x + w, y: coords.y}) +
    isUsedCoords({x: coords.x - w, y: coords.y}) +
    isUsedCoords({x: coords.x, y: coords.y + w}) +
    isUsedCoords({x: coords.x, y: coords.y - w});

  return counter > 1;
}

function createToothpichNeighbors(toothpick) {
  let toothpickPosition = nextToothpickPosition(toothpick.orientation);

  let new_toothpicks = []

  toothpick.neighborCoords.forEach((coords) => {
    if (isUsedCoords(coords) || isSqueezed(coords)) return;

    new_toothpick = createToothpick(coords, toothpickPosition);

    new_toothpicks.push(new_toothpick);
  })

  return new_toothpicks;
}

function render() {
  let canvas = document.getElementById('canvas');

  let context = canvas.getContext('2d');

  new_toothpicks.forEach((toothpick) => {
    data = toothpick.renderData;

    context.fillRect(data.x, data.y, data.width, data.height);
  })
}

function gen_new_toothpicks() {
  // toothpicks = toothpicks.concat(new_toothpicks);

  let brand_new_toothpicks = []
  new_toothpicks.forEach(t => brand_new_toothpicks = brand_new_toothpicks.concat(createToothpichNeighbors(t)));

  new_toothpicks = brand_new_toothpicks;
}

let firstToothpick = createToothpick(startingCoords, "verical");

let new_toothpicks = [firstToothpick];
let toothpicks = [];

function main() {
  gen_new_toothpicks();

  render();
}

setInterval(main, 200)

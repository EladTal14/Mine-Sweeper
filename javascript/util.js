//TODO///s
function getRandomInt(min, max) {
  min = Math.ceil(min);
  max = Math.floor(max);
  return Math.floor(Math.random() * (max - min) + min);
}

function easy() {
  gLevel = {
    SIZE: 4,
    MINES: 2
  };
  reset()
}
function medium() {
  gLevel = {
    SIZE: 8,
    MINES: 12
  };
  reset()
}
function hard() {
  gLevel = {
    SIZE: 12,
    MINES: 30
  };
  reset()
}

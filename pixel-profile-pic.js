const Alea = require("alea");
const PImage = require("pureimage");

/**
 * @param {number} width - width of each cell
 * @param {number} cell  - number of cells in x and y axis
 * @param {string} color - color in hex format
 * @param {string} seed  - seed for pseudo random number generation
 *
 * @returns {PImage}
 */
module.exports = (width, cell, color, seed) => {
  const img = PImage.make(width * cell, width * cell);
  const ctx = img.getContext("2d");
  const prng = new Alea(seed);

  for (var i = 0; i <= Math.floor(cell / 2); i++) {
    for (var j = 0; j <= cell; j++) {
      if (Math.floor(prng() * 9) > 4) {
        try {
          ctx.fillStyle = color;
        } catch (e) {
          ctx.fillStyle = "#000000";
        }
      } else {
        ctx.fillStyle = "#ffffff";
      }

      // from left
      ctx.fillRect(i * width, j * width, width, width);
      // from right
      ctx.fillRect(cell * width - width - i * width, j * width, width, width);
    }
  }

  return img;
};

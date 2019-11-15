import "babylonjs-loaders";
import { Game } from "./game";

window.addEventListener("DOMContentLoaded", () => {
  const game = new Game("renderCanvas");
  game.createScene();
  game.animate();
});

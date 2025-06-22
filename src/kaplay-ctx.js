import kaboom from "kaplay";

export const kCtx = kaboom({
  global: true,
  touchToMouse: true,

  canvas: document.getElementById("game"),
  width: 400,
  height: 400,
});

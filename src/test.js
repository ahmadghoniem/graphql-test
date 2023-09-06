import chroma from "chroma-js";
const c = chroma.hsl(
  ..."208 45% 23%"
    .split(" ")
    .map((e, i) => (i === 0 ? parseInt(e) : parseFloat(e) / 100)),
);
console.log(c.rgb());

import chroma from "chroma-js";
const c = chroma.rgb(..."255 254 255".split(" "));
console.log(c.css());

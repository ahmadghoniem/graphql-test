import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import App from "./App";

import tinyColor from "tinycolor2";
console.log(tinyColor("255 0 1"));
ReactDOM.createRoot(document.getElementById("root")).render(<App />);

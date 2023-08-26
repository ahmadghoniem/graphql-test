import ReactDOM from "react-dom/client";
// import App from "./App.jsx";
import "./index.css";
import { MyApp } from "./MyApp";
const NewApp = () => {
  return <div></div>;
};
console.log(NewApp.name);
ReactDOM.createRoot(document.getElementById("root")).render(<MyApp />);

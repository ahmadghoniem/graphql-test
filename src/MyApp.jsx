import { useState } from "react";
import { Comp } from "./Comp";

export const MyApp = () => {
  const [value, setValue] = useState(null);
  console.log(value?.rgb());
  console.log(value?.css());
  console.log(
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--result-text-color"),
  );
  return <Comp onChange={setValue} />;
};

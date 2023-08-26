import { useState } from "react";
import { ColorPickerRoot,ColorPickerPalette,ColorPickerHue } from "./ColorPicker";

export const MyApp = () => {
  const [value, setValue] = useState(null);
  console.log(value?.rgb());
  console.log(value?.css());
  console.log(
    window
      .getComputedStyle(document.documentElement)
      .getPropertyValue("--result-text-color"),
  );
  
  return <ColorPickerRoot onChange={setValue} >
    <ColorPickerPalette />
    <ColorPickerHue />
  </ColorPickerRoot>;
};

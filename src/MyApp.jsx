import { useEffect, useRef, useState } from "react";
import {
  ColorPickerRoot,
  ColorPickerPalette,
  ColorPickerHue,
  ColorPickerPanel,
  ColorPickerMarker,
  ColorPickerHueSlider,
} from "./ColorPicker";
// use text-[--result-text-color] to get the inverted text color on a color-changing background
// use value.rgb() to get the selected color in rgb format
// use value.css() to get the selected color in css usable format
// Usestate for text-color with it's handle change
// accessibility  and shadncn collab
// use native for zero dependencies rather than chroma-js
export const MyApp = () => {
  const [value, setValue] = useState(null);
  const [textColor, setTextColor] = useState(null);
  // setting the css variables on the makes t he colorpicker completely uncontrolled and as read-only
  // you can't set the color from elsewhere otherthan the palette itself
  return (
    <div>
      <p className=" bg-[rgb(var(--selected-color))]/90 text-[rgb(var(--result-text-color))]/100 ">
        Hello, World
      </p>
      <ColorPickerRoot
        className="flex flex-row gap-2 bg-[#24283B]"
        onColorChange={(color) => {
          console.log(color.rgb());
          fetch(`${color}`);
        }}
        onTextColorChange={setTextColor}
        luminanceSetPoint={0.179}
      >
        <ColorPickerPanel className="w-full">
          <ColorPickerPalette>
            <ColorPickerMarker />
          </ColorPickerPalette>
        </ColorPickerPanel>
        {/**you would ned to adjust width of pickerhue to us the circle slider */}
        <ColorPickerHue className="w-9">
          <ColorPickerHueSlider variant="circle" size="md" />
        </ColorPickerHue>
      </ColorPickerRoot>
    </div>
  );
};

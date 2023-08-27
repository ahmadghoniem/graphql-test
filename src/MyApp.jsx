import { useState } from "react";
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
  const [luminanceSetPoint, setLuminanceSetPoint] = useState("0.5");
  console.log(value?.rgb());
  console.log(textColor?.rgb());
  return (
    <>
      <p
        className="text-[--selected-color]"
        style={{ color: textColor?.css(), backgroundColor: value?.css() }}
      ></p>
      <ColorPickerRoot
        className="flex flex-row gap-2 bg-[#24283B]"
        onColorChange={setValue}
        onTextColorChange={setTextColor}
        luminanceSetPoint={luminanceSetPoint}
      >
        <ColorPickerPanel className="w-full">
          <ColorPickerPalette>
            <ColorPickerMarker />
          </ColorPickerPalette>
        </ColorPickerPanel>
        <ColorPickerHue className="w-9">
          <ColorPickerHueSlider className="h-1 rounded-none border border-[#c4bebe]" />
        </ColorPickerHue>
      </ColorPickerRoot>
    </>
  );
};

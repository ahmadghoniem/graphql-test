import { useState } from "react";
import {
  ColorPickerRoot,
  ColorPickerPalette,
  ColorPickerHue,
  ColorPickerPanel,
  ColorPickerMarker,
} from "./ColorPicker";
// use text-[--result-text-color] to get the inverted text color on a color-changing background
// use value.rgb() to get the selected color in rgb format
// use value.css() to get the selected color in css usable format
// Usestate for text-color with it's handle change
// accessibility  and shadncn collab
// use native for zero dependencies rather than chroma-js
export const MyApp = () => {
  const [value, setValue] = useState(null);
  console.log(value?.rgb());

  return (
    <ColorPickerRoot
      className="grid grid-cols-12 grid-rows-4 gap-x-2"
      onChange={setValue}
    >
      <p className="col-span-12 row-span-1 bg-[--selected-color] text-[--result-text-color]">
        hello world
      </p>
      <ColorPickerPanel className="col-span-10 row-span-3 w-full">
        <ColorPickerPalette>
          <ColorPickerMarker />
        </ColorPickerPalette>
      </ColorPickerPanel>
      <ColorPickerHue className="col-span-2 row-span-3 h-full w-2" />
    </ColorPickerRoot>
  );
};

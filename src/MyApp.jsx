import {
  useEffect,
  useRef,
  useState,
  isValidElement,
  cloneElement,
} from "react";
import {
  ColorPickerProvider,
  ColorPickerPalette,
  ColorPickerHue,
  ColorPickerPanel,
  ColorPickerMarker,
  ColorPickerHueSlider,
  ColorPickerContent,
} from "./ColorPicker";
import { Card, CardContent, CardTitle } from "./card";

// use text-[--result-text-color] to get the inverted text color on a color-changing background
// use onChange along with DefaultValue to control the colorPicker an option if this went live
// use value.rgb() to get the selected color in rgb format
// use value.css() to get the selected color in css usable format
// Usestate for text-color with it's handle change
// accessibility  and shadncn collab
export const MyApp = () => {
  // const [value, setValue] = useState(null);
  // const [defaultColor, setDefaultColor] = useState("#24283B");
  // const [textColor, setTextColor] = useState(null);
  // const myRef = useRef(null);
  // console.log(defaultColor);
  // setting the css variables on the makes t he colorpicker completely uncontrolled and as read-only
  // you can't set the color from elsewhere otherthan the palette itself
  return (
    <Card>
      <CardContent asChild>
        <ColorPickerProvider className="bg-[#24283B]" luminanceSetPoint={0.179}>
          <CardTitle className=" bg-[--selected-color] text-[rgb(var(--result-text-color))]/100 ">
            Hello, World
          </CardTitle>

          <ColorPickerContent className="">
            <ColorPickerPanel className="w-full">
              <ColorPickerPalette>
                <ColorPickerMarker />
              </ColorPickerPalette>
            </ColorPickerPanel>
            {/**you would ned to adjust width of pickerhue to us the circle slider */}
            <ColorPickerHue className="w-9">
              <ColorPickerHueSlider variant="circle" size="md" className="" />
            </ColorPickerHue>
          </ColorPickerContent>
        </ColorPickerProvider>
      </CardContent>
    </Card>
  );
};

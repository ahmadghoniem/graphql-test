import { useRef } from "react";
import {
  ColorPickerProvider,
  ColorPickerPalette,
  ColorPickerHue,
  ColorPickerPanel,
  ColorPickerMarker,
  ColorPickerHueSlider,
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
  const myRef = useRef(null);
  // console.log(defaultColor);
  // setting the css variables on the makes t he colorpicker completely uncontrolled and as read-only
  // you can't set the color from elsewhere otherthan the palette itself
  return (
    <Card className="flex-col flex " ref={myRef}>
      <CardContent asChild>
        {/**delegates all style of cardcontent to colorpickerContent provider while keeping the logic inside of the content intact */}
        <ColorPickerProvider
          RenderPanel={(props) => (
            <ColorPickerPanel {...props} className="col-span-1 row-span-1">
              <ColorPickerPalette>
                <ColorPickerMarker />
              </ColorPickerPalette>
            </ColorPickerPanel>
          )}
          RenderHue={({ hueRef }) => (
            <ColorPickerHue
              ref={hueRef}
              className="row-span-1 col-span-1 max-w-[9rem]"
            >
              <ColorPickerHueSlider />
            </ColorPickerHue>
          )}
          className="bg-[#24283B] "
          luminanceSetPoint={0.179}
        >
          <CardTitle className="row-span-1 max-h-max col-span-2 bg-[rgb(var(--selected-color))] text-[rgb(var(--result-text-color))]/100 ">
            Hello, World
          </CardTitle>
        </ColorPickerProvider>
      </CardContent>
    </Card>
  );
};

///////////////////////////////////////////////////////////////////////////////////////////////////////

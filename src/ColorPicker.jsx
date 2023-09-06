/* eslint-disable react/no-unknown-property */

import React, { Children, cloneElement, useMemo } from "react";

import chroma from "chroma-js";
import {
  clamp,
  useCombinedRefs,
  useMousemove,
  cn,
  HslArgsFromCSS,
} from "./utils.js";
import { cva } from "class-variance-authority";
const presetCssVars = {
  "--selected-color": "100 100% 100%",
  "--palette-marker-x": "0",
  "--palette-marker-y": "0",
  "--hue-slider-y:": "0",
  "--selected-hue": "#ffffff",
};
const styleVariant = cva(
  "absolute -left-[0.125rem] h-[0.625rem] w-[calc(100%+0.25rem)] translate-y-[calc(var(--hue-slider-y,0)*1px-2px)] bg-[--selected-hue]",
  {
    variants: {
      variant: {
        default:
          "rounded-none border border-[#c4bebe] cursor-grab select-none active:cursor-grabbing",
        circle: "rounded-full border border-[rgb(var(--selected-color))]/90",
      },
      size: {
        default: "h-1 border",
        md: "h-3 border-4",
      },
    },
    defaultVariants: {
      variant: "default",
      size: "default",
    },
  },
);

export const ColorPickerProvider = React.forwardRef(
  (
    {
      onColorChange,
      onTextColorChange,
      defaultValue = "#ff0000",
      luminanceSetPoint = 0.5,
      className,
      children,
      ...props
    },
    ref,
  ) => {
    const picker = useCombinedRefs(React.useRef(), ref);
    const palette = React.useRef();
    const hue = React.useRef();
    const handleChange = React.useRef();
    const styleObj = useMemo(
      () => ({ presetCssVars, "--selected-hue": defaultValue }),
      [defaultValue],
    );

    React.useEffect(() => {
      handleChange.current = onColorChange;
      // handleTextColorChange.current = onTextColorChange;
      // onTextColorChange;
    }, [onColorChange]);

    const onchange = React.useCallback(() => {
      if (handleChange.current) {
        const root = picker.current;
        const color = chroma(HslArgsFromCSS(root, "--selected-color"));
        handleChange.current(color);
      }
    }, [picker]);

    const updateText = React.useCallback(() => {
      const root = picker.current;
      const color = chroma(HslArgsFromCSS(root, "--selected-color"));
      console.log(chroma.scale([bg, color])(1).luminance());
      const bg = chroma("#1a202c");
      if (chroma.scale([bg, color])(1).luminance() > luminanceSetPoint) {
        picker.current.style.setProperty(
          "--result-text-color",
          "220 25.71% 13.73%",
        );
      } else {
        picker.current.style.setProperty(
          "--result-text-color",
          "204 45.45% 97.84%",
        );
      }
    }, [picker, luminanceSetPoint]);
    // update text and color when hue changes?
    React.useEffect(() => {
      const root = picker.current;
      const c =
        typeof defaultValue === "string" ? chroma(defaultValue) : defaultValue;
      const h = c.get("hsl.h") || 0;
      root.style.setProperty("--selected-hue", chroma.hsl(h, 1, 0.5).hex());
      root.style.setProperty(
        "--selected-color",
        c.css("hsl").slice(4, -1).replaceAll(",", " "),
      );

      const el = palette.current;
      console.log(palette);
      const elRect = el.getBoundingClientRect();
      root.style.setProperty(
        "--palette-marker-x",
        (elRect.width * c.get("hsv.s")).toString(),
      );
      root.style.setProperty(
        "--palette-marker-y",
        (elRect.height * (1 - c.get("hsv.v"))).toString(),
      );
      root.style.setProperty(
        "--hue-slider-y",
        ((h / 360) * elRect.height).toString(),
      );
      updateText();
    }, [picker, updateText, defaultValue]);

    // MOUSE MOVES
    useMousemove(palette, (e) => {
      const el = palette.current;
      const root = picker.current;
      const elRect = el.getBoundingClientRect();
      let x = clamp(e.clientX - elRect.left, 0, elRect.width);
      let y = clamp(e.clientY - elRect.top, 0, elRect.height);
      const h = chroma(root.style.getPropertyValue("--selected-hue")).get(
        "hsv.h",
      );
      const selectedColor = chroma.hsv(
        h,
        x / elRect.width,
        1 - y / elRect.height,
      );
      root.style.setProperty(
        "--selected-color",
        chroma(selectedColor).css("hsl").slice(4, -1).replaceAll(",", " "),
      );

      root.style.setProperty("--palette-marker-x", x.toString());
      root.style.setProperty("--palette-marker-y", y.toString());
      updateText();
      onchange();
    });
    useMousemove(hue, (e) => {
      const el = hue.current;
      const root = picker.current;
      const pl = palette.current;
      const elRect = el.getBoundingClientRect();
      const y = clamp(e.clientY - elRect.top, 0, elRect.height);
      const selectedHue = chroma.hsl((y / elRect.height) * 360, 1, 0.5);
      root.style.setProperty("--selected-hue", selectedHue.css("hsl"));
      root.style.setProperty("--hue-slider-y", y.toString());
      const plRect = pl.getBoundingClientRect();
      const px = root.style.getPropertyValue("--palette-marker-x");
      const py = root.style.getPropertyValue("--palette-marker-y");
      const c1 = chroma.mix(
        "#fff",
        "#000",
        parseFloat(py) / plRect.height,
        "rgb",
      );
      const c2 = chroma.mix(
        selectedHue,
        "#000",
        parseFloat(py) / plRect.height,
        "rgb",
      );
      const selectedColor = chroma.mix(
        c1,
        c2,
        parseFloat(px) / plRect.width,
        "rgb",
      );
      root.style.setProperty(
        "--selected-color",
        chroma(selectedColor).css("hsl").slice(4, -1).replaceAll(",", " "),
      );

      updateText();
      onchange();
    });

    return (
      <div
        aria-label="color-picker-provider"
        style={styleObj}
        className={cn("flex flex-col w-80  p-3 shadow-md gap-y-4", className)}
        ref={picker}
        {...props}
      >
        {Children.map(children, (child) =>
          cloneElement(
            child,
            child.type.displayName === "ColorPickerContent" &&
              Children.count(child.props.children) === 2
              ? { paletteRef: palette, hueRef: hue }
              : null,
          ),
        )}
      </div>
    );
  },
);
ColorPickerProvider.displayName = "ColorPickerProvider";

export const ColorPickerContent = React.forwardRef(
  ({ className, children, paletteRef, hueRef, ...props }, ref) => {
    return (
      <div
        aria-label="color-picker-content"
        className={cn("flex flex-row gap-4", className)}
      >
        {Children.map(children, (child) => {
          return cloneElement(child, {
            ref:
              child.type.displayName === "ColorPickerPanel"
                ? paletteRef
                : child.type.displayName === "ColorPickerHue"
                ? hueRef
                : null,
          });
        })}
      </div>
    );
  },
);
ColorPickerContent.displayName = "ColorPickerContent";

export const ColorPickerPanel = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div aria-label="panel" className={cn("grid h-48 gap-3", className)}>
        {React.cloneElement(children, { ref })}
      </div>
    );
  },
);
ColorPickerPanel.displayName = "ColorPickerPanel";

export const ColorPickerPalette = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        aria-label="palette"
        className={cn("relative bg-[--selected-hue]", className)}
        ref={ref}
      >
        <div className="absolute h-full w-full bg-[--selected-hue] bg-[image:var(--palette-saturation-gradient)]" />
        {children}
      </div>
    );
  },
);
ColorPickerPalette.displayName = "ColorPickerPalette";
// bg could be transp arent as well ! bg-transp arent
export const ColorPickerMarker = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        aria-label="marker"
        className={cn(
          "absolute h-4 w-4 translate-x-[calc(var(--palette-marker-x,0)*1px-8px)]  translate-y-[calc(var(--palette-marker-y,0)*1px-8px)] transform rounded-full border-2 border-[#f7fafc] bg-[--selected-color]",
          className,
        )}
      />
    );
  },
);
ColorPickerMarker.displayName = "ColorPickerMarker";

export const ColorPickerHue = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        aria-label="hue"
        ref={ref}
        className={cn("relative bg-white", className)}
      >
        <div className="absolute h-full w-full bg-[image:--hue-gradient]" />
        {children}
      </div>
    );
  },
);
ColorPickerHue.displayName = "ColorPickerHue";
// -2px in calc is for the border-width i guess (nope)
export const ColorPickerHueSlider = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        aria-label="slider"
        className={cn(
          styleVariant({
            variant,
            size,
            className,
          }),
        )}
      />
    );
  },
);
ColorPickerHueSlider.displayName = "ColorPickerHueSlider";

// out-of-thebox// prebuilt color component
const ColorPicker = React.forwardRef(
  ({ className, variant, size, ...props }, ref) => {
    return (
      <div
        aria-label="slider"
        className={cn(
          styleVariant({
            variant,
            size,
            className,
          }),
        )}
      />
    );
  },
);
ColorPicker.displayName = "ColorPicker";
export default ColorPicker;

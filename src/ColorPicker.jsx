/* eslint-disable react/no-unknown-property */
/** @jsxImportSource @emotion/react */

import React, { Children, cloneElement } from "react";
import chroma from "chroma-js";
import { clamp, useCombinedRefs, useMousemove, cn } from "./utils.js";
const presetCssVar = {
  "--selected-color": "#ffffff",
  "--selected-hue": "#ff0000",
  "--palette-marker-x": "0",
  "--palette-marker-y": "0",
  "--hue-slider-y:": "0",
};
export const ColorPickerRoot = React.forwardRef(
  (
    { onChange, defaultValue = "#ff0000", className, children, ...props },
    ref,
  ) => {
    const picker = useCombinedRefs(React.useRef(), ref);
    const palette = React.useRef();
    const hue = React.useRef();
    const handleChange = React.useRef();
    React.useEffect(() => {
      handleChange.current = onChange;
    }, [onChange]);
    const onchange = React.useCallback(() => {
      if (handleChange.current) {
        const root = picker.current;

        const color = chroma(root.style.getPropertyValue("--selected-color"));
        handleChange.current(color);
      }
    }, [picker]);
    const updateText = React.useCallback(() => {
      const root = picker.current;
      const color = chroma(root.style.getPropertyValue("--selected-color"));

      const bg = chroma("#1a202c");
      if (chroma.scale([bg, color])(1).luminance() > 0.5) {
        picker.current.style.setProperty("--result-text-color", "#1a202c");
      } else {
        picker.current.style.setProperty("--result-text-color", " #f7fafc");
      }
    }, [picker]);
    React.useEffect(() => {
      const root = picker.current;
      const c =
        typeof defaultValue === "string" ? chroma(defaultValue) : defaultValue;
      const h = c.get("hsl.h") || 0;
      root.style.setProperty("--selected-hue", chroma.hsl(h, 1, 0.5).hex());
      root.style.setProperty("--selected-color", c.hex());
      const el = palette.current;
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
      if (e.ctrlKey) {
        x = parseFloat(root.style.getPropertyValue("--palette-marker-x"));
      }
      let y = clamp(e.clientY - elRect.top, 0, elRect.height);
      if (e.shiftKey) {
        y = parseFloat(root.style.getPropertyValue("--palette-marker-y"));
      }
      const h = chroma(root.style.getPropertyValue("--selected-hue")).get(
        "hsv.h",
      );
      const selectedColor = chroma.hsv(
        h,
        x / elRect.width,
        1 - y / elRect.height,
      );
      root.style.setProperty("--selected-color", selectedColor.hex());
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
      root.style.setProperty("--selected-color", selectedColor.hex());
      updateText();
      onchange();
    });

    return (
      <div
        aria-label="color-picker"
        ref={picker}
        style={presetCssVar}
        className={cn(
          "w-80 bg-[--color-picker-background] p-3 shadow-md",
          className,
        )}
        {...props}
      >
        {Children.map(children, (child, index) => {
          console.log(child);
          return cloneElement(child, {
            ref:
              child.type.displayName === "ColorPickerPanel"
                ? palette
                : child.type.displayName === "ColorPickerHue"
                ? hue
                : null,
          });
        })}
      </div>
    );
  },
);
ColorPickerRoot.displayName = "ColorPickerRoot";

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
        className={cn("relative bg-[#df3f3f] bg-[--selected-hue]", className)}
        ref={ref}
      >
        <div className="absolute h-full w-full bg-[--selected-hue]">
          <div className="absolute h-full w-full bg-gradient-to-r from-white" />
          <div className="absolute h-full w-full bg-gradient-to-b from-transparent to-black" />
        </div>

        {children}
      </div>
    );
  },
);
ColorPickerPalette.displayName = "ColorPickerPalette";
// bg could be transparent as well ! bg-transparent
export const ColorPickerMarker = React.forwardRef(
  ({ className, children, ...props }, ref) => {
    return (
      <div
        aria-label="marker"
        className="absolute h-4 w-4 translate-x-[calc(var(--palette-marker-x,0)*1px-8px)] translate-y-[calc(var(--palette-marker-y,0)*1px-8px)] transform rounded-full border-2 border-[#f7fafc] bg-[--selected-color]"
      />
    );
  },
);
ColorPickerMarker.displayName = "ColorPickerMarker";

export const ColorPickerHue = React.forwardRef(
  ({ className, ...props }, ref) => {
    return (
      <div
        aria-label="hue"
        ref={ref}
        className={cn("relative bg-white", className)}
      >
        <div className="absolute h-full w-full bg-[image:--hue-gradient]" />
        <div
          aria-label="slider"
          className="absolute -left-[0.0125rem] h-[0.625rem] w-[calc(100%+0.25rem)] translate-y-[calc(var(--hue-slider-y,0)*1px-5px)] rounded-full border-2 border-[#f7fafc] bg-[--selected-hue]"
        />
      </div>
    );
  },
);
ColorPickerHue.displayName = "ColorPickerHue";

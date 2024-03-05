# Effective/Color

[![Sponsored by][sponsor-img]][sponsor] [![Version][npm-version-img]][npm] [![Downloads][npm-downloads-img]][npm]

[sponsor]: https://www.sebastian-software.de
[sponsor-img]: https://badgen.net/badge/Sponsored%20by/Sebastian%20Software/c41e54
[npm]: https://www.npmjs.com/package/@effective/color
[npm-downloads-img]: https://badgen.net/npm/dm/@effective/color
[npm-version-img]: https://badgen.net/npm/v/@effective/color

This [npm package](https://www.npmjs.com/package/@effective/color) is a TypeScript library designed for developers and designers to create sophisticated color palettes, similar to those seen in _Tailwind CSS_ or _Material Design_ systems. Unlike simpler tools that adjust colors by adding white or black or merely tweaking brightness and chroma, this library utilizes a scientifically based approach for color differentiation (_CIEDE94_).

This library is based on the wonderful [Culori] library:

> Culori is a JavaScript color library that supports the conversion and manipulation of all formats defined in the CSS Colors Level 4 specification, plus additional color spaces. It handles color differences, interpolation, gradients, blend modes and much more.

## Features

- **Scientifically-Driven Color Mixing**: Utilizing the _OKLab_ color space, our library transcends basic color manipulation by embracing sophisticated color mixing techniques. By meticulously adjusting the proportions of base colors, we achieve nuanced changes in hue, saturation, and lightness that are perceptibly visible to the human eye. Our approach is deeply rooted in color theory, ensuring the palettes we generate are not only aesthetically pleasing but also in harmony with human visual perception, offering a refined blend of art and science in every palette.
- **Modern Color Standards**: By incorporating the _OKLCH_ color model alongside the widely embraced P3 color space, our color palette generator sets a new benchmark in color design. _OKLCH_ is celebrated for its perceptual uniformity, which simplifies the process of making intuitive adjustments to hue, chroma, and lightness, facilitating the creation of balanced and harmonious palettes with ease. The _P3_ color space, renowned for its broader color gamut, enables the production of more vibrant, saturated, and true-to-life colors. This strategic combination guarantees your palettes will shine with unparalleled brilliance on the latest displays.
- **TypeScript Compatibility**: Engineered as a TypeScript library, our solution is crafted to integrate seamlessly into your development ecosystem. It empowers developers to incorporate complex color schemes directly into projects, bypassing the need for a graphical interface. This feature ensures a smooth, efficient workflow, enabling the effortless application of advanced color science principles into your digital creations, blending functionality with creativity seamlessly.

## Demo

To see our library in action and explore the possibilities it offers, check out our [Storybook demo](https://effective-color.vercel.app/).

## Getting Started

To begin using this library in your projects, simply add it to your project using npm:

```bash
npm install @effective/color
```

## API

### `buildShades()`

The `buildShades` function generates an array of color shades between two specified colors in the _Oklab_ color space. This function allows for the creation of smooth color stops from one color to another, which is primary meant for very light and very dark shades for one base color.

#### Parameters:

- **start**: `string` - The starting color in any CSS-compatible format.
- **end**: `string` - The ending color in any CSS-compatible format.
- **config**: `ShadeConfig` (optional) - An object specifying the configuration for shade generation, including:

  - **colorSteps**: `number` [default=`5`] - The number of color shades to generate
  - **colorDifference**: `number` [default=`2`] - The perceptual difference between consecutive shades. A higher value results in more distinct shades.
  - **darkColorCompensation**: `number` [default=`5`] - A factor to adjust the progression curve of the color transition for very dark colors.
  - **mixerSteps**: `number` [default=`0.001`] - Internal step value used for reaching the target color difference. Smaller numbers increase precision but also runtime.
  - **outputSpace**: `string` [default=`oklch`] - Any supported output space by Culori.

  colorSteps: 5,
  colorDifference: 2,
  darkColorCompensation: 5,
  mixerSteps: 0.001,
  outputSpace: "oklch"

#### Returns:

- An array of `Oklab` objects representing the generated shades between the start and end colors.

#### Visual Example

![Light Shades](docs/light-shades.png)
![Dark Shades](docs/dark-shades.png)

### `buildSpectrum()`

The `buildSpectrum` function creates a color spectrum based on a starting color and configuration, allowing for the creation of a wide range of colors derived from a single base. This can be particularly useful for generating thematic color sets or for applications requiring a consistent but varied set of colors.

#### Parameters:

- **start**: `string` - The base color from which the spectrum will be generated, in any CSS-compatible format.
- **config**: `ShadeConfig` (optional) - An object specifying the configuration for the spectrum generation, similar to the `buildShades` function, but tailored to creating a broader spectrum of colors.

#### Returns:

- A `ColorSpectrum` object, which is a record of color identifiers mapped to their corresponding color values in either `Oklab` or `string` format. This structure facilitates easy access and manipulation of the color spectrum.

#### Visual Example

![Light Shades](docs/spectrum.png)

### `spectrumToList()`

The `spectrumToList` function converts a `ColorSpectrum` object into a list format, making it more convenient to iterate over or display the spectrum in a linear fashion, such as in a list or dropdown menu in a user interface.

#### Parameters:

- **spectrum**: `ColorSpectrum` - The color spectrum to convert, structured as a record of color identifiers to color values.

#### Returns:

- A `SpectrumList`, which is an array of `SpectrumEntry` objects, each containing:
  - **id**: `string` - The identifier of the color, serving as a key or label.
  - **value**: `string | Oklab` - The color value, which can be either a CSS-compatible string or an Oklab object.

## License

[Apache License; Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2024<br/>[Sebastian Software GmbH](https://www.sebastian-software.de)

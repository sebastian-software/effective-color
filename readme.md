# Effective/Color

This npm package is a TypeScript library designed for developers and designers to create sophisticated color palettes, similar to those seen in Tailwind CSS or Material Design systems. Unlike simpler tools that adjust colors by adding white or black or merely tweaking brightness and chroma, this library utilizes a scientifically based approach for color differentiation.

## Features

- **Scientific Approach to Color Differentiation**: Instead of basic color manipulation, our library employs color mixing techniques. It carefully adjusts the proportions of base colors to achieve perceptible changes in hue, saturation, or lightness, visible to the human eye, according to specific parameters.
- **Rooted in Color Theory**: The methodology is informed by color theory, ensuring that the generated palettes are not only visually appealing but also consistent with human visual perception.
- **TypeScript Support**: As a TypeScript library, it seamlessly integrates into your development workflow, enabling the direct implementation of complex color schemes in your projects without a graphical interface.

## Demo

To see our library in action and explore the possibilities it offers, check out our [Storybook demo](https://effective-color.vercel.app/).

## Getting Started

To begin using this library in your projects, simply add it to your project using npm:

```bash
npm install @effective/color
```

## API

### `buildShades()`

The `buildShades` function generates an array of color shades between two specified colors in the Oklab color space. This function allows for the creation of smooth gradients or transitions from one color to another, which can be particularly useful in UI design, data visualization, or any application where a natural progression of colors is needed.

#### Parameters:

- **start**: `string` - The starting color in any CSS-compatible format.
- **end**: `string` - The ending color in any CSS-compatible format.
- **config**: `ShadeConfig` (optional) - An object specifying the configuration for shade generation, including:
  - **steps**: `number` - The number of color shades to generate, including the start and end colors.
  - **difference**: `number` - The perceptual difference between consecutive shades. A higher value results in more distinct shades.
  - **compensation**: `number` - A factor to adjust the progression curve of the color transition, allowing for more nuanced control over the gradient.

#### Returns:

- An array of `Oklab` objects representing the generated shades between the start and end colors.

### `buildSpectrum()`

The `buildSpectrum` function creates a color spectrum based on a starting color and configuration, allowing for the creation of a wide range of colors derived from a single base. This can be particularly useful for generating thematic color sets or for applications requiring a consistent but varied set of colors.

#### Parameters:

- **start**: `string` - The base color from which the spectrum will be generated, in any CSS-compatible format.
- **config**: `ShadeConfig` (optional) - An object specifying the configuration for the spectrum generation, similar to the `buildShades` function, but tailored to creating a broader spectrum of colors.

#### Returns:

- A `ColorSpectrum` object, which is a record of color identifiers mapped to their corresponding color values in either `Oklab` or `string` format. This structure facilitates easy access and manipulation of the color spectrum.

### `spectrumToList()`

The `spectrumToList` function converts a `ColorSpectrum` object into a list format, making it more convenient to iterate over or display the spectrum in a linear fashion, such as in a list or dropdown menu in a user interface.

#### Parameters:

- **spectrum**: `ColorSpectrum` - The color spectrum to convert, structured as a record of color identifiers to color values.

#### Returns:

- A `SpectrumList`, which is an array of `SpectrumEntry` objects, each containing:
  - **id**: `string` - The identifier of the color, serving as a key or label.
  - **value**: `string | Oklab` - The color value, which can be either a CSS-compatible string or an Oklab object.

## General Notes

- The use of the Oklab color space provides a more perceptually uniform color progression compared to traditional color spaces like RGB or HSL, making these functions particularly suitable for applications where color accuracy and perception are critical.
- Optional configuration in these functions allows for flexibility and fine-tuning of color generation, accommodating a wide range of use cases from subtle gradients to vibrant spectrums.

## License

[Apache License; Version 2.0, January 2004](http://www.apache.org/licenses/LICENSE-2.0)

## Copyright

<img src="https://cdn.rawgit.com/sebastian-software/sebastian-software-brand/0d4ec9d6/sebastiansoftware-en.svg" alt="Logo of Sebastian Software GmbH, Mainz, Germany" width="460" height="160"/>

Copyright 2023-2024<br/>[Sebastian Software GmbH](https://www.sebastian-software.de)

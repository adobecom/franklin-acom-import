function rgbToHex(rgb) {
  // Split the RGB color value into its components
  const components = rgb.match(/\d+/g) ?? [];

  // Convert each component to hexadecimal
  const hexComponents = components.map((component) => {
    const hex = Number(component).toString(16);
    return hex.length === 1 ? `0${hex}` : hex;
  });

  // Concatenate the hexadecimal components to form the hex color code
  const hexCode = `#${hexComponents.join('')}`.toUpperCase();

  return hexCode;
}

const compose = (...fns) => (inputParams) => fns.reduce((acc, fn) => {
  const result = fn(inputParams, acc);
  return [...acc, ...result];
}, []);

export { compose, rgbToHex };

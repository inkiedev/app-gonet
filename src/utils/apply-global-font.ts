import { Text, TextInput, Platform } from 'react-native';

let isApplied = false;

export const applyGlobalFont = (fontFamily = 'Montserrat_400Regular', textColor?: string) => {
  if (isApplied) return;
  
  // For Text component
  const oldTextRender = (Text as any).render;
  (Text as any).render = function (...args: any[]) {
    const origin = oldTextRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily, ...(textColor && { color: textColor }) }, origin.props.style]
    });
  };

  // For TextInput component  
  const oldTextInputRender = (TextInput as any).render;
  (TextInput as any).render = function (...args: any[]) {
    const origin = oldTextInputRender.call(this, ...args);
    return React.cloneElement(origin, {
      style: [{ fontFamily, ...(textColor && { color: textColor }) }, origin.props.style]
    });
  };

  isApplied = true;
};

export const resetGlobalFont = () => {
  isApplied = false;
};
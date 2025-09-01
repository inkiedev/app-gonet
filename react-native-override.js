import { Text, TextInput } from 'react-native';

const originalTextRender = Text.render;
const originalTextInputRender = TextInput.render;

Text.render = function(props, ref) {
  return originalTextRender.call(this, {
    ...props,
    style: [{ fontFamily: 'Montserrat_400Regular' }, props.style]
  }, ref);
};

TextInput.render = function(props, ref) {
  return originalTextInputRender.call(this, {
    ...props,
    style: [{ fontFamily: 'Montserrat_400Regular' }, props.style]
  }, ref);
};
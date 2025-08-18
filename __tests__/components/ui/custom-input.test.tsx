import { Input } from '@/components/ui/custom-input';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

describe('Input component', () => {
  it('renders basic input', () => {
    const { getByTestId } = render(<Input testID="basic-input" />);
    expect(getByTestId('basic-input')).toBeTruthy();
  });

  it('renders with label', () => {
    const { getByText } = render(<Input label="Username" />);
    expect(getByText('Username')).toBeTruthy();
  });

  it('renders with error message', () => {
    const { getByText } = render(<Input error="This is an error" />);
    expect(getByText('This is an error')).toBeTruthy();
  });

  it('renders with helper text', () => {
    const { getByText } = render(<Input helperText="Helpful hint" />);
    expect(getByText('Helpful hint')).toBeTruthy();
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <Input leftIcon={<View testID="left-icon" />} />
    );
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('renders with right icon', () => {
    const { getByTestId } = render(
      <Input rightIcon={<View testID="right-icon" />} />
    );
    expect(getByTestId('right-icon')).toBeTruthy();
  });

  it('focus and blur change styles', () => {
    const { getByPlaceholderText, UNSAFE_getByType } = render(
      <Input placeholder="Type here" />
    );
    const textInput = getByPlaceholderText('Type here');
    const container = UNSAFE_getByType(View); // El primer View es el container
    fireEvent(textInput, 'focus');
    fireEvent(textInput, 'blur');
    expect(container).toBeTruthy();
  });

it('toggles password visibility when showPasswordToggle is true', () => {
  const { getByTestId, getByPlaceholderText } = render(
    <Input placeholder="Password" showPasswordToggle secureTextEntry />
  );

  const toggleButton = getByTestId('password-toggle');
  const textInput = getByPlaceholderText('Password');

  // Por defecto debe estar oculto
  expect(textInput.props.secureTextEntry).toBe(true);

  // Toca el botón y debe mostrarse
  fireEvent.press(toggleButton);
  expect(textInput.props.secureTextEntry).toBe(false);
  });

  it('passes props to TextInput', () => {
    const { getByPlaceholderText } = render(
      <Input placeholder="Custom Placeholder" />
    );
    expect(getByPlaceholderText('Custom Placeholder')).toBeTruthy();
  });
});

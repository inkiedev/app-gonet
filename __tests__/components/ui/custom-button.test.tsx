import { Button } from '@/components/ui/custom-button';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { View } from 'react-native';

describe('Button Component', () => {
  const mockOnPress = jest.fn();

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with title', () => {
    const { getByText } = render(
      <Button title="Test Button" onPress={mockOnPress} />
    );
    expect(getByText('Test Button')).toBeTruthy();
  });

  it('calls onPress when pressed', () => {
    const { getByText } = render(
      <Button title="Press Me" onPress={mockOnPress} />
    );
    fireEvent.press(getByText('Press Me'));
    expect(mockOnPress).toHaveBeenCalledTimes(1);
  });

  it('shows loading indicator when loading', () => {
    const { getByTestId, queryByText } = render(
      <Button title="Loading" onPress={mockOnPress} loading testID="loading-button" />
    );
    expect(queryByText('Loading')).toBeFalsy();
    expect(getByTestId('loading-button')).toBeTruthy();
  });

  it('is disabled when disabled prop is true', () => {
    const { getByText } = render(
      <Button title="Disabled" onPress={mockOnPress} disabled />
    );
    const button = getByText('Disabled').parent;
    fireEvent.press(button);
    expect(mockOnPress).not.toHaveBeenCalled();
  });

  it('renders with different variants', () => {
    const variants = ['primary', 'secondary', 'outline', 'ghost'] as const;
    variants.forEach(variant => {
      const { getByText } = render(
        <Button title={`${variant} Button`} onPress={mockOnPress} variant={variant} />
      );
      expect(getByText(`${variant} Button`)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { getByText } = render(
        <Button title={`${size} Button`} onPress={mockOnPress} size={size} />
      );
      expect(getByText(`${size} Button`)).toBeTruthy();
    });
  });

  it('renders with icon', () => {
    const { getByText, getByTestId } = render(
      <Button
        title="With Icon"
        onPress={mockOnPress}
        icon={<View testID="icon" />}
      />
    );

    expect(getByText('With Icon')).toBeTruthy();
    expect(getByTestId('icon')).toBeTruthy();
  });
});
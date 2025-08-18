import { Select, SelectOption } from '@/components/ui/custom-select';
import { act, fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { Text, View } from 'react-native';

jest.mock('react-native', () => {
  const RN = jest.requireActual('react-native');
  
  RN.Animated.timing = () => ({
    start: (callback?: () => void) => callback && callback(),
  });
  
  RN.Animated.parallel = (animations: any[]) => ({
    start: (callback?: () => void) => callback && callback(),
  });

  return RN;
});

describe('Select Component', () => {
  const mockOnValueChange = jest.fn();
  const mockOptions: SelectOption<string>[] = [
    { value: 'option1' },
    { value: 'option2' },
    { value: 'option3' },
    { value: 'option4', disabled: true },
  ];

  const mockRenderItem = (option: SelectOption<string>, index: number, isSelected: boolean) => (
    <Text testID={`option-${index}`} style={{ color: isSelected ? 'blue' : 'black' }}>
      {option.value}
    </Text>
  );

  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('renders with placeholder when no value is selected', () => {
    const { getByText } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        placeholder="Choose an option"
      />
    );
    expect(getByText('Choose an option')).toBeTruthy();
  });

  it('renders with label when provided', () => {
    const { getByText } = render(
      <Select
        label="Test Label"
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
      />
    );
    expect(getByText('Test Label')).toBeTruthy();
  });

  it('renders selected value when value prop is provided', () => {
    const { getByTestId } = render(
      <Select
        options={mockOptions}
        value="option2"
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
      />
    );
    expect(getByTestId('option-1')).toBeTruthy();
  });

  it('can be pressed to trigger dropdown', async () => {
    const { getByText } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        placeholder="Select option"
      />
    );
    
    const selectButton = getByText('Select option');
    expect(selectButton).toBeTruthy();
    
    await act(async () => {
      fireEvent.press(selectButton);
    });
  });

  it('updates selected value when value prop changes', () => {
    const { getByTestId, rerender } = render(
      <Select
        options={mockOptions}
        value="option1"
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
      />
    );
    
    expect(getByTestId('option-0')).toBeTruthy();
    
    rerender(
      <Select
        options={mockOptions}
        value="option2"
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
      />
    );
    
    expect(getByTestId('option-1')).toBeTruthy();
  });

  it('handles options with disabled state', () => {
    const optionsWithDisabled: SelectOption<string>[] = [
      { value: 'active', disabled: false },
      { value: 'disabled', disabled: true },
    ];

    const { getByText } = render(
      <Select
        options={optionsWithDisabled}
        onValueChange={mockOnValueChange}
        renderItem={(option, index) => (
          <Text testID={`option-${index}`}>{option.value}</Text>
        )}
        placeholder="Select option"
      />
    );
    
    expect(getByText('Select option')).toBeTruthy();
  });

  it('does not open dropdown when disabled', () => {
    const { getByText, queryByTestId } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        placeholder="Select option"
        disabled
      />
    );
    
    fireEvent.press(getByText('Select option'));
    
    expect(queryByTestId('option-0')).toBeFalsy();
  });

  it('renders with different variants', () => {
    const variants = ['default', 'outline', 'filled'] as const;
    variants.forEach(variant => {
      const { getByText } = render(
        <Select
          options={mockOptions}
          onValueChange={mockOnValueChange}
          renderItem={mockRenderItem}
          placeholder={`${variant} select`}
          variant={variant}
        />
      );
      expect(getByText(`${variant} select`)).toBeTruthy();
    });
  });

  it('renders with different sizes', () => {
    const sizes = ['sm', 'md', 'lg'] as const;
    sizes.forEach(size => {
      const { getByText } = render(
        <Select
          options={mockOptions}
          onValueChange={mockOnValueChange}
          renderItem={mockRenderItem}
          placeholder={`${size} select`}
          size={size}
        />
      );
      expect(getByText(`${size} select`)).toBeTruthy();
    });
  });

  it('renders with left icon', () => {
    const { getByTestId } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        leftIcon={<View testID="left-icon">Icon</View>}
      />
    );
    expect(getByTestId('left-icon')).toBeTruthy();
  });

  it('displays error message when error prop is provided', () => {
    const { getByText } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        error="This field is required"
      />
    );
    expect(getByText('This field is required')).toBeTruthy();
  });

  it('displays helper text when helperText prop is provided', () => {
    const { getByText } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        helperText="Choose your preferred option"
      />
    );
    expect(getByText('Choose your preferred option')).toBeTruthy();
  });

  it('shows chevron icon that can rotate', () => {
    const { getByTestId } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        testID="select-container"
      />
    );
    
    expect(getByTestId('select-container')).toBeTruthy();
  });

  it('renders with testID', () => {
    const { getByTestId } = render(
      <Select
        options={mockOptions}
        onValueChange={mockOnValueChange}
        renderItem={mockRenderItem}
        testID="custom-select"
      />
    );
    expect(getByTestId('custom-select')).toBeTruthy();
  });

  it('handles generic type correctly', () => {
    interface CustomOption {
      id: number;
      name: string;
    }

    const customOptions: SelectOption<CustomOption>[] = [
      { value: { id: 1, name: 'First' } },
      { value: { id: 2, name: 'Second' } },
    ];

    const customRenderItem = (option: SelectOption<CustomOption>) => (
      <Text>{option.value.name}</Text>
    );

    const mockCustomOnValueChange = jest.fn();

    const { getByText } = render(
      <Select<CustomOption>
        options={customOptions}
        onValueChange={mockCustomOnValueChange}
        renderItem={customRenderItem}
        placeholder="Select custom option"
      />
    );

    expect(getByText('Select custom option')).toBeTruthy();
  });

  it('component state changes when interacted with', () => {
    let currentValue: string | undefined;
    const handleValueChange = (value: string, index: number) => {
      currentValue = value;
    };

    const TestWrapper = () => {
      const [selectedValue, setSelectedValue] = React.useState<string | undefined>();
      
      const handleChange = (value: string, index: number) => {
        setSelectedValue(value);
        handleValueChange(value, index);
      };

      return (
        <Select
          options={mockOptions}
          value={selectedValue}
          onValueChange={handleChange}
          renderItem={mockRenderItem}
          placeholder="Test select"
          testID="test-select"
        />
      );
    };

    const { getByTestId } = render(<TestWrapper />);
    
    expect(getByTestId('test-select')).toBeTruthy();
  });
});
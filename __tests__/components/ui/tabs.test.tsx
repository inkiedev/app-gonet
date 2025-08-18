// tabs.test.tsx
import Tabs, { Tab } from '@/components/ui/tabs';
import { fireEvent, render } from '@testing-library/react-native';
import React from 'react';
import { ScrollView, Text, View } from 'react-native';

const makeTabs = (): Tab[] => [
  { id: 'tab1', label: 'Tab 1', content: <View testID="tab1-content"><Text>One</Text></View> },
  { id: 'tab2', label: 'Tab 2', content: <View testID="tab2-content"><Text>Two</Text></View> },
  { id: 'tab3', label: 'Tab 3', content: <View testID="tab3-content"><Text>Three</Text></View>, disabled: true },
];

describe('Tabs component', () => {
  it('renders root and first tab active por defecto', () => {
    const { getByTestId, queryByTestId } = render(<Tabs testID="tabs" tabs={makeTabs()} />);
    expect(getByTestId('tabs')).toBeTruthy();
    expect(getByTestId('tabs-tab-tab1')).toBeTruthy();
    expect(queryByTestId('tab1-content')).toBeTruthy();
    expect(queryByTestId('tab2-content')).toBeNull();
  });

  it('uses initialTabId when provided and valid (✅ reescrito sin getByText)', () => {
    const { getByTestId, queryByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} initialTabId="tab2" />
    );
    // Contenido de la tab2 está presente y el de la tab1 no
    expect(getByTestId('tab2-content')).toBeTruthy();
    expect(queryByTestId('tab1-content')).toBeNull();
    // Accesibilidad: la tab2 aparece seleccionada
    const tab2 = getByTestId('tabs-tab-tab2');
    expect(tab2.props.accessibilityState?.selected).toBe(true);
  });

  it('falls back to first tab if initialTabId is invalid', () => {
    const { getByTestId, queryByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} initialTabId="invalid" />
    );
    expect(getByTestId('tab1-content')).toBeTruthy();
    expect(queryByTestId('tab2-content')).toBeNull();
  });

  it('changes tab on press and calls onTabChange', () => {
    const onTabChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} onTabChange={onTabChange} />
    );

    // Antes: tab1 activa
    expect(queryByTestId('tab1-content')).toBeTruthy();
    expect(queryByTestId('tab2-content')).toBeNull();

    // Cambiar a tab2
    fireEvent.press(getByTestId('tabs-tab-tab2'));

    expect(queryByTestId('tab1-content')).toBeNull();
    expect(queryByTestId('tab2-content')).toBeTruthy();
    expect(onTabChange).toHaveBeenCalledWith('tab2', 1);
  });

  it('does not call onTabChange when pressing the already active tab', () => {
    const onTabChange = jest.fn();
    const { getByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} onTabChange={onTabChange} />
    );
    fireEvent.press(getByTestId('tabs-tab-tab1')); // ya activa
    expect(onTabChange).not.toHaveBeenCalled();
  });

  it('does not switch or call onTabChange when pressing a disabled tab', () => {
    const onTabChange = jest.fn();
    const { getByTestId, queryByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} onTabChange={onTabChange} />
    );
    fireEvent.press(getByTestId('tabs-tab-tab3')); // disabled
    expect(onTabChange).not.toHaveBeenCalled();
    // sigue visible el contenido de la activa (tab1)
    expect(queryByTestId('tab1-content')).toBeTruthy();
  });

  it('renders scrollable tab bar when tabsScrollable is true', () => {
    const { UNSAFE_getAllByType } = render(
      <Tabs testID="tabs" tabs={makeTabs()} tabsScrollable />
    );
    // debe haber al menos un ScrollView horizontal para la barra de tabs
    const scrollViews = UNSAFE_getAllByType(ScrollView);
    const hasHorizontal = scrollViews.some(sv => !!sv.props.horizontal);
    expect(hasHorizontal).toBe(true);
  });

  it('renders scrollable content when contentScrollable is true', () => {
    const { getByTestId } = render(
      <Tabs testID="tabs" tabs={makeTabs()} contentScrollable />
    );
    expect(getByTestId('tabs-content-scroll')).toBeTruthy();
  });

  it('applies accessibility props to tabs', () => {
    const { getByTestId } = render(<Tabs testID="tabs" tabs={makeTabs()} />);
    const tab1 = getByTestId('tabs-tab-tab1');
    const tab3 = getByTestId('tabs-tab-tab3');
    expect(tab1.props.accessibilityRole).toBe('tab');
    expect(tab1.props.accessibilityLabel).toBe('Tab 1 tab');
    expect(tab1.props.accessibilityState?.selected).toBe(true);
    expect(tab3.props.accessibilityState?.disabled).toBe(true);
  });

  it('warns and returns null if no tabs are provided', () => {
    const warnSpy = jest.spyOn(console, 'warn').mockImplementation(() => {});
    const { toJSON } = render(<Tabs testID="tabs" tabs={[]} />);
    expect(toJSON()).toBeNull();
    expect(warnSpy).toHaveBeenCalledWith('[Tabs] No tabs provided');
    warnSpy.mockRestore();
  });

  it('respects variant prop without crashear (smoke tests)', () => {
    const base = makeTabs();
    const { unmount: u1 } = render(<Tabs testID="tabs1" tabs={base} variant="default" />);
    u1();
    const { unmount: u2 } = render(<Tabs testID="tabs2" tabs={base} variant="minimal" />);
    u2();
    const { unmount: u3 } = render(<Tabs testID="tabs3" tabs={base} variant="bordered" />);
    u3();
  });
});

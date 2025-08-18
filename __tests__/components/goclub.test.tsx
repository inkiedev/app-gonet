// __tests__/CedulaScreen.test.tsx
import { act, fireEvent, render } from "@testing-library/react-native";
import React from "react";
import CedulaScreen from "../../app/(tabs)/home/goclub";

// Mock router
const mockBack = jest.fn();
jest.mock("expo-router", () => ({
  router: { back: mockBack },
}));

// Mock QRCode (para evitar renderizado real)
jest.mock("react-native-qrcode-svg", () => {
  return () => <></>;
});

describe("CedulaScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    jest.useFakeTimers();
  });

  it("renderiza el nombre del usuario en la tarjeta inicial", () => {
    const { getByText } = render(<CedulaScreen />);
    expect(getByText("Juan Pérez")).toBeTruthy();
  });



  it("cambia de tarjeta a QR al presionar el TouchableOpacity", () => {
    const { getByTestId, queryByText } = render(<CedulaScreen />);
    const flipTouchable = getByTestId("flip-touchable");

    // Inicialmente muestra el nombre
    expect(queryByText("Juan Pérez")).toBeTruthy();

    act(() => {
      fireEvent.press(flipTouchable);
      jest.advanceTimersByTime(300); // Avanzar el tiempo de la animación
    });

    // Después del flip ya no debería mostrarse el nombre
    expect(queryByText("Juan Pérez")).toBeNull();
  });

  it("muestra nuevamente la tarjeta después de dos flips", () => {
    const { getByTestId, queryByText } = render(<CedulaScreen />);
    const flipTouchable = getByTestId("flip-touchable");

    // Primer flip (tarjeta -> QR)
    act(() => {
      fireEvent.press(flipTouchable);
      jest.advanceTimersByTime(300);
    });

    expect(queryByText("Juan Pérez")).toBeNull();

    // Segundo flip (QR -> tarjeta)
    act(() => {
      fireEvent.press(flipTouchable);
      jest.advanceTimersByTime(300);
    });

    expect(queryByText("Juan Pérez")).toBeTruthy();
  });

  it("ejecuta las funciones de los botones inferiores", () => {
    const consoleSpy = jest.spyOn(console, "log").mockImplementation(() => {});
    const { getByText } = render(<CedulaScreen />);

    fireEvent.press(getByText("Establecimientos"));
    expect(consoleSpy).toHaveBeenCalledWith("Establecimientos");

    fireEvent.press(getByText("Historial"));
    expect(consoleSpy).toHaveBeenCalledWith("Historial");

    consoleSpy.mockRestore();
  });
});

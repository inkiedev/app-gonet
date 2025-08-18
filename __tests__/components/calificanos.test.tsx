import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import CalificanosScreen from "../../app/(tabs)/home/calificanos";

// Mock de Alert
jest.spyOn(Alert, "alert");

describe("CalificanosScreen", () => {
  describe("Renderizado inicial", () => {
    it("muestra el título principal", () => {
      const { getByText } = render(<CalificanosScreen />);
      expect(getByText("Califica Nuestra App")).toBeTruthy();
    });

    it("muestra la puntuación inicial en 0", () => {
      const { getByText } = render(<CalificanosScreen />);
      expect(getByText("Puntuación actual: 0")).toBeTruthy();
    });

    it("actualiza la puntuación a 4 después de 1 segundo", async () => {
    jest.useFakeTimers();
    const { getByText } = render(<CalificanosScreen />);

    // Avanza manualmente el tiempo 1s
    jest.advanceTimersByTime(1000);

    await waitFor(() =>
        expect(getByText("Puntuación actual: 4")).toBeTruthy()
    );

    jest.useRealTimers(); // restaurar
    });
  });

  describe("Sistema de estrellas", () => {
    it("cambia la puntuación al presionar una estrella", () => {
      const { getByText, getAllByTestId } = render(<CalificanosScreen />);
      const stars = getAllByTestId("star-icon");
      fireEvent.press(stars[2]); // tercera estrella
      expect(getByText("Puntuación actual: 3")).toBeTruthy();
    });
  });

  describe("Tabs y contenidos", () => {
    it("muestra Encuestas por defecto", () => {
      const { getByText } = render(<CalificanosScreen />);
      expect(getByText("Encuestas")).toBeTruthy();
      expect(getByText("No hay encuestas en este momento")).toBeTruthy();
    });

    it("cambia a la pestaña Sugerencias", () => {
      const { getByText, getByTestId } = render(<CalificanosScreen />);
      
      fireEvent.press(getByText("Sugerencias"));
      expect(getByTestId("card_sugerencias")).toBeTruthy();
      expect(getByText("Enviar")).toBeTruthy();
    });

    it("cambia a la pestaña Síguenos", () => {
      const { getByText } = render(<CalificanosScreen />);
      fireEvent.press(getByText("Síguenos"));
      expect(getByText("Contáctanos")).toBeTruthy();
    });
  });

  describe("Formulario de sugerencias", () => {
    it("muestra error si se intenta enviar vacío", () => {
      const { getByText } = render(<CalificanosScreen />);
      fireEvent.press(getByText("Sugerencias"));
      fireEvent.press(getByText("Enviar"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Error",
        "Por favor escribe una sugerencia."
      );
    });

    it("muestra confirmación si se envía con texto válido", () => {
      const { getByText, getByPlaceholderText } = render(<CalificanosScreen />);
      fireEvent.press(getByText("Sugerencias"));
      const input = getByPlaceholderText("Tu sugerencia aquí...");
      fireEvent.changeText(input, "Me gusta la app");
      fireEvent.press(getByText("Enviar"));
      expect(Alert.alert).toHaveBeenCalledWith(
        "Enviado",
        "Tu sugerencia fue: Me gusta la app"
      );
    });
  });

  describe("Síguenos", () => {
    it("muestra los botones sociales", () => {
      const { getByText, getAllByTestId } = render(<CalificanosScreen />);
      fireEvent.press(getByText("Síguenos"));
      expect(getAllByTestId("social-icon").length).toBe(4); // whatsapp, messenger, email, phone
    });
  });
});

import { cleanup, render, screen, waitFor } from "@testing-library/react-native";
import React from "react";
import PerfilScreen from "../app/(tabs)/home/perfil";
import InternetPlans, { availablePlans } from "../app/(tabs)/home/planes";

// Mock router
jest.mock("expo-router", () => ({
  useRouter: () => ({ back: jest.fn() }),
}));

// Usar timers falsos
beforeAll(() => {
  jest.useFakeTimers();
});

afterEach(() => {
  cleanup();
  jest.runOnlyPendingTimers(); // corre timers que quedaron pendientes
  jest.clearAllTimers();       // limpia cualquier otro timer
});

afterAll(() => {
  jest.useRealTimers();
});

describe("PerfilScreen", () => {
  it("P-01 Visualizar datos personales", async () => {
    render(<PerfilScreen />);

    await waitFor(() => {
      // Verificar que la pantalla se renderiza correctamente
      expect(screen.getByText("Ajustes")).toBeTruthy();
    });
  });
});

describe("InternetPlans Screen", () => {
  it("P-02: muestra plan actual con datos correctos", async () => {
    render(<InternetPlans />);

    await waitFor(() => {
      expect(screen.getByText("Plan actual")).toBeTruthy();
      expect(screen.getByText(/Velocidad: 250 Mbps/)).toBeTruthy();
    });
  });

  it("P-03: muestra lista de planes adicionales", async () => {
    render(<InternetPlans />);

    await waitFor(() => {
      expect(screen.getByText("Actualizar Plan")).toBeTruthy();

      availablePlans.forEach(plan => {
        expect(screen.getByText(plan.name)).toBeTruthy();
        expect(
          screen.getByText(new RegExp(`Precio: \\$${plan.price}`))
        ).toBeTruthy();

        // Validar detalles (puede haber repetidos, usamos getAllByText)
        plan.details.forEach(detail => {
          const elements = screen.getAllByText(new RegExp(detail));
          expect(elements.length).toBeGreaterThan(0);
        });
      });
    });
  });
});

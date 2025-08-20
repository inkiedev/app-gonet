import { fireEvent, render, waitFor } from "@testing-library/react-native";
import React from "react";
import { Alert } from "react-native";
import RegisterScreen from "../app/(auth)/register"; // ajusta la ruta si es distinta

/* --- Mock de Alert --- */
jest.spyOn(Alert, "alert");

describe("RegisterScreen", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  /* R-01 Registro con datos correctos */
  it("R-01: should register successfully with valid data", async () => {
    const { getByPlaceholderText, getByText } = render(<RegisterScreen />);

    fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Juan Perez");
    fireEvent.changeText(getByPlaceholderText("Email"), "juan@test.com");
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "123456");
    fireEvent.changeText(getByPlaceholderText("Cédula"), "1718137159"); // válida

    fireEvent.press(getByText("Registrar Cuenta"));

    await waitFor(() => {
      expect(Alert.alert).toHaveBeenCalledWith(
        "Registration Successful",
        expect.stringContaining("Juan Perez")
      );
    });
  });

  /* R-02 Registro con campos incompletos */
  it("R-02: should show validation errors when fields are incomplete", async () => {
    const { getByText } = render(<RegisterScreen />);

    fireEvent.press(getByText("Registrar Cuenta"));

    await waitFor(() => {
      expect(getByText("Mínimo 3 caracteres")).toBeTruthy();
      expect(getByText("Formato de email invalido")).toBeTruthy();
      expect(getByText("Mínimo 6 caracteres")).toBeTruthy();
      expect(getByText("Cédula no coincide el formato")).toBeTruthy();
    });
  });

  /* R-03 Registro con cédula inválida */
  it("R-03: should show error when cedula is invalid", async () => {
    const { getByPlaceholderText, getByText, findByText } = render(
      <RegisterScreen />
    );

    fireEvent.changeText(getByPlaceholderText("Nombre Completo"), "Juan Perez");
    fireEvent.changeText(getByPlaceholderText("Email"), "juan@test.com");
    fireEvent.changeText(getByPlaceholderText("Contraseña"), "123456");
    fireEvent.changeText(getByPlaceholderText("Cédula"), "1234567890"); // válida

    fireEvent.press(getByText("Registrar Cuenta"));

    expect(await findByText("Cédula no coincide el formato")).toBeTruthy();
  });
});

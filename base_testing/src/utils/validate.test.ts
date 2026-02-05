import { it, expect } from "vitest";
import { validateNumber, validateStringNotEmpty } from "./validate";

it("comprobación de lanzamiento de error si pasamos un string vacio", () => {
  const content = "";

  const result = () => validateStringNotEmpty(content);

  expect(result).toThrow();
});

it("comprobación de lanzamiento de error si pasamos un string vacio declarando el mensaje de error", () => {
  const content = "";

  const result = () => validateStringNotEmpty(content);

  expect(result).toThrow(/Invalid input/);
});

it("Comprobación de lanzamiento de error si pasas un numero en formato string", () => {
  const content = 1;

  const result = () => validateNumber(content);

  expect(result).not.toThrow();
});

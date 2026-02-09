/**
 * REGLAS:
 * 1. Mínimo 8 caracteres.
 * 2. Debe contener al menos un número.
 * 3. No puede contener espacios en blanco.
 */
export const validatePassword = (password: string): boolean => {
  const hasMinLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasNoSpaces = !/\s/.test(password);

  return hasMinLength && hasNumber && hasNoSpaces;
};
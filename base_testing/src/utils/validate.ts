export function validateStringNotEmpty(value: string) {
  if (value.trim().length === 0) {
    throw new Error("Invalid input");
  }
}

export function validateNumber(value: number) {
  if (isNaN(value)) {
    throw new Error("Invalid number input");
  }
}

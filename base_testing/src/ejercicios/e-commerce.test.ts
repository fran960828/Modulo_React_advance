import { describe, expect, it } from "vitest";
import { applyDiscount, formatCurrency, sumPrices, type Product } from "./e-commerce";

describe('sumPrices()', () => {
  it('debe devolver la suma correcta aunque los precios tengan decimales', () => {
    // Arrange
    const products: Product[] = [
      { name: 'Pan', price: 1.5 },
      { name: 'Agua', price: 0.99 }
    ];

    // Act
    const result = sumPrices(products);

    // Assert
    expect(result).toBeCloseTo(2.49, 2);
  });
});

describe('applyDiscount()', () => {
  it('debe calcular el descuento correctamente con decimales complejos', () => {
    const total = 100;
    const discount = 0.33; // 33% dto
    const result = applyDiscount(total, discount);
    
    // 100 * 0.67 = 67
    expect(result).toBeCloseTo(67, 2);
  });
});

describe('formatCurrency()', () => {
  it('debe devolver el formato de moneda exacto con dos decimales', () => {
    const amount = 10.5;
    const result = formatCurrency(amount);

    // En lugar de toContain, verificamos el formato final esperado
    // Esto asegura que no falten los decimales (.50) ni el símbolo
    expect(result).toBe('$10.50');
  });

  it('debe manejar cantidades enteras añadiendo .00', () => {
    expect(formatCurrency(10)).toBe('$10.00');
  });
});
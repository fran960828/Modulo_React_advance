export interface Product {
  name: string;
  price: number;
}

// 1. Sumar precios
export const sumPrices = (products: Product[]): number => {
  return products.reduce((acc, p) => acc + p.price, 0);
};

// 2. Aplicar descuento (ej: 0.1 para 10%)
export const applyDiscount = (total: number, discount: number): number => {
  if (discount < 0 || discount > 1) return total;
  return total * (1 - discount);
};

// 3. Formatear moneda
export const formatCurrency = (amount: number): string => {
  return `$${amount.toFixed(2)}`;
};
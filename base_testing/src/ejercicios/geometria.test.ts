import { describe, expect, it } from "vitest";
import { calculateCircleArea } from "./geometria";


describe('calculateCircleArea()',()=>{
    it('debe retornar un error si se le pasa un numero negativo',()=>{
        const radius=-2

        const result=()=>calculateCircleArea(radius)

        expect(result).toThrow(/Invalid radius/)
    })
    it('debe retornar un numero si se le pasa un numero positivo',()=>{
        const radius=2

        const result=calculateCircleArea(radius)

        expect(result).toBeTypeOf("number")
    })
    it('debe retornar cero si se le pasa un 0',()=>{
        const radius=0

        const result=calculateCircleArea(radius)

        expect(result).toBe(0)
    })
    it('debe calcular el área correctamente para un radio positivo', () => {
        const radius = 2;
        const expectedArea = Math.PI * 4; // 12.56637...

        const result = calculateCircleArea(radius);

        // En lugar de toBeTypeOf, verificamos el valor exacto con tolerancia de decimales
        // El segundo parámetro (2) es el número de decimales de precisión
        expect(result).toBeCloseTo(expectedArea, 5);
    });
})
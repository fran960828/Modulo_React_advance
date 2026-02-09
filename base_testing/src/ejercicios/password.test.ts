import { describe,it,expect } from "vitest";
import { validatePassword } from "./password";

describe('validatePassword()', () => {
    
    // CASO DE ÉXITO
    it('debe retornar true si la contraseña es válida (8+ caracteres, números, sin espacios)', () => {
        // Arrange
        const validPassword = 'fng8487_';
        
        // Act
        const result = validatePassword(validPassword);
        
        // Assert
        expect(result).toBe(true);
    });

    // CASOS DE FALLO (Separados para identificar errores rápido)
    it('debe retornar false si la longitud es menor a 8 caracteres', () => {
        // Podemos ser más directos en casos simples
        expect(validatePassword('fng12')).toBe(false);
    });

    it('debe retornar false si no contiene ningún número', () => {
        expect(validatePassword('abcdefgh')).toBe(false);
    });

    it('debe retornar false si contiene espacios en blanco', () => {
        // Aquí probamos que ni al inicio ni en medio debe haber espacios
        expect(validatePassword(' fNG8487964')).toBe(false);
        expect(validatePassword('fNG 8487964')).toBe(false);
    });

    it('debe retorna false si se le pasa un string vacio',()=>{
        const password=''

        const result=validatePassword(password)

        expect(result).toBe(false)
    })
    it('debe retorna false si se le pasa un salto de linea vacio',()=>{
        const password='\nfrancisco7'

        const result=validatePassword(password)

        expect(result).toBe(false)
    })

});
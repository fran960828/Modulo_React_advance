import {it,expect} from 'vitest'
import { conversor } from './conversor'

it('prueba de funcionamiento',()=>{
    const value='4'

    const result=conversor(value)

    expect(result).toBe(Number(value))

})

it('Prueba de error al no pasar un numero',()=>{
    const value='t'

    const result=conversor(value)

    expect(result).toBeNaN()
})

it('Prueba de error al no pasar nada',()=>{
    

    const result=()=>conversor(_)

    expect(result).toThrow()
})


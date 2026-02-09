import { describe, expect, it } from "vitest";
import { calculatePoints } from "./gamificacion";


describe('calculatePoints()',()=>{
    it('Debe retornar 1 al eleguir guest',()=>{
        const userType='guest'
        const action='comment'

        const result=calculatePoints(userType,action)

        expect(result).toBe(1)
    })
    it('Debe retornar un resultado especifico segun la action al pasar member',()=>{
        const userType='member'
        const action='comment'

        const result=calculatePoints(userType,action)

        expect(result).toBe(2)
    })
    it('Debe retornar un resultado especifico segun la action al pasar member',()=>{
        const userType='member'
        const action='post'

        const result=calculatePoints(userType,action)

        expect(result).toBe(5)
    })
    it('Debe retornar un resultado especifico segun la action al pasar member',()=>{
        const userType='member'
        const action='share'

        const result=calculatePoints(userType,action)

        expect(result).toBe(10)
    })
    it('Debe retornar un resultado especifico segun la action al pasar premium',()=>{
        const userType='premium'
        const action='comment'

        const result=calculatePoints(userType,action)

        expect(result).toBe(4)
    })
    it('Debe retornar un resultado especifico segun la action al pasar premium',()=>{
        const userType='premium'
        const action='post'

        const result=calculatePoints(userType,action)

        expect(result).toBe(10)
    })
    it('Debe retornar un resultado especifico segun la action al pasar premium',()=>{
        const userType='premium'
        const action='share'

        const result=calculatePoints(userType,action)

        expect(result).toBe(20)
    })
    it('Debe retornar un resultado especifico segun la action al pasar premium',()=>{
        const userType='premium'
        const action='like' as any

        const result=()=>calculatePoints(userType,action)

        expect(result).toThrow(/Action not recognized/)
    })
})
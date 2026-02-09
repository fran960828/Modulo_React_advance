import { describe, expect, it, beforeEach } from "vitest";
import { TodoService } from "./todoList";

describe('TodoService', () => {
    let service: TodoService;

    // Se ejecuta antes de cada 'it', manteniendo los tests aislados
    beforeEach(() => {
        service = new TodoService();
    });

    it('debe iniciar con una lista de tareas vacía', () => {
        expect(service.getAll()).toHaveLength(0);
    });

    it('debe añadir una tarea correctamente y verificar su estructura', () => {
        service.addTodo('Aprender Testing');
        const todos = service.getAll();

        expect(todos).toHaveLength(1);
        // Verificamos el contenido del objeto usando toMatchObject
        expect(todos[0]).toMatchObject({
            text: 'Aprender Testing',
            completed: false
        });
        expect(todos[0].id).toBeTypeOf('number');
    });

    it('debe cambiar el estado de completado (toggle)', () => {
        service.addTodo('Tarea X');
        const id = service.getAll()[0].id;

        service.toggleTodo(id);
        expect(service.getAll()[0].completed).toBe(true);

        service.toggleTodo(id); // Volvemos a cambiar
        expect(service.getAll()[0].completed).toBe(false);
    });

    it('debe filtrar solo las tareas pendientes', () => {
        service.addTodo('Pendiente');
        setTimeout(() => {
            service.addTodo('Completada');
            const idCompletada = service.getAll()[1].id;
            service.toggleTodo(idCompletada);
    
            const pending = service.getPending();
            
            expect(pending).toHaveLength(1);
            expect(pending[0].text).toBe('Pendiente');
        }, 20);
        
    });

    it('no debe hacer nada si se intenta hacer toggle de un ID inexistente', () => {
        service.addTodo('Tarea Real');
        service.toggleTodo(999); // ID inventado

        expect(service.getAll()[0].completed).toBe(false);
    });
});


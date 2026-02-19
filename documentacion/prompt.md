rol: Experto en cypress consulta: Haz una documentación para una persona principiante con una explicación en forma de comentario al inicio y tras la explicación emplea un ejemplo sencillo para que quede más claro los siguientes conceptos:

- Explicación y uso stubs indicando porque son necesario y cuando deben usarse.
- Explicación y uso de cy.stub dentro del then de visit usando como primer argumento window.navigator.geolocation, y segundo argumento getCurrentPosition en formato string.
- Explicación sobre asignarle un alias a la función cy.stub anterior para luego usar un get que compruebe que ha sido llamada con should('have.been.called').
- Explicación y uso de callsFake que simula la ejecución de getCurrentPosition pero le pasamos unas coordenadas ficticias.
- Explicación y uso de cy.stub dentro del then de visit usando como primer argumento window.clipboard, y segundo argumento writeTest en formato string con un alias para comprobar que ha sido llamada y resolve porque se trata de una promesa, después comprobamos que ha sido llamada con should('have.been.calledWithMatch',new RegExp).

Especificaciones:-La documentación debe contener la explicación detallada de todo lo necesario para el uso de los conceptos a nivel profesional-Los ejemplos deben estar explicados con comentarios sobre lo que hacen en cada paso -El formato de entrega será markdown. Verificación:Revisa el contenido de la consulta para obtener el resultado deseado, recuerda que lo más importante es que los ejemplos estén bien explicados , tomate el tiempo necesario para obtener el mejor resultado.

genera el markdown de la documentación para descargar pero no te dejes nada de lo que has desarrollado en el primer prompt.

genera un serie de ejercicios para practicar todos estos conceptos, estos ejercicios deben diferir de los que has puesto de ejemplo y aumentar progresivamente de dificultad hasta el punto de alcanzar un uso profesional y fluido. Genera el número de ejercicios que consideres necesario para alcanzar un buen nivel de dominio

import inquirer from 'inquirer';

export async function mostrarMenuProyectos() {
    console.clear();
    const preguntas = [
        {
            type: 'list',
            name: 'opcion',
            message: 'Gestión de Proyectos - Selecciona una opción:',
            choices: [
                {
                    value: '1',
                    name: '1. Aceptar Propuesta y Generar Proyecto'
                },
                {
                    value: '2',
                    name: '2. Listar Proyectos'
                },
                {
                    value: '3',
                    name: '3. Actualizar Proyecto'
                },
                {
                    value: '4',
                    name: '4. Eliminar Proyecto'
                },
                {
                    value: '5',
                    name: '5. Registrar Avance'
                },
                {
                    value: '0',
                    name: '0. Volver al menú principal'
                }
            ]
        }
    ];

    const { opcion } = await inquirer.prompt(preguntas);
    return opcion;
}
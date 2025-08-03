import inquirer from 'inquirer';

export async function pedirDatosProyecto() {
    const preguntas = [
        {
            type: 'input',
            name: 'descripcion',
            message: 'Ingresa la descripción del proyecto:',
            validate: (input) => input !== '' || 'La descripción no puede estar vacía.',
        },
        {
            type: 'input',
            name: 'presupuesto',
            message: 'Ingresa el presupuesto del proyecto:',
            validate: (input) => !isNaN(input) || 'El presupuesto debe ser un número.',
        },
        {
            type: 'input',
            name: 'fechaInicio',
            message: 'Ingresa la fecha de inicio (YYYY-MM-DD):',
            validate: (input) => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato de fecha inválido. Usa YYYY-MM-DD.',
        },
    ];

    const respuestas = await inquirer.prompt(preguntas);
    return respuestas;
}
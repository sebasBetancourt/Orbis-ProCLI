import inquirer from 'inquirer';

export async function pedirDatosProyecto() {
  const preguntas = [
    {
      type: 'input',
      name: 'nombre',
      message: 'Ingresa el nombre del proyecto:',
      validate: (input) => input.trim() !== '' || 'El nombre no puede estar vacío.',
    },
  ];

  const respuestas = await inquirer.prompt(preguntas);
  return respuestas;
}
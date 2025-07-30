import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenuProyecto() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.blue('Gestión de Proyectos - Selecciona una opción:'),
      choices: [
        { name: chalk.green('1. Crear Proyecto'), value: '1' },
        { name: chalk.green('2. Listar Proyectos'), value: '2' },
        { name: chalk.green('3. Actualizar Proyecto'), value: '3' },
        { name: chalk.green('4. Eliminar Proyecto'), value: '4' },
        { name: chalk.green('5. Registrar Avance'), value: '5' },
        { name: chalk.red('0. Volver al menú principal'), value: '0' },
      ],
    }
  ]);
  return opcion;
}
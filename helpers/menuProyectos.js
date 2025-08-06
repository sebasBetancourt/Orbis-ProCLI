import inquirer from 'inquirer';
import chalk from 'chalk';

export async function mostrarMenuProyectos() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta(`Administrar Proyectos:🧩`),
      choices: [
        { name: chalk.cyan('1. Listar Proyectos'), value: '1' },
        { name: chalk.cyan('2. Actualizar Estado de Proyecto'), value: '2' },
        { name: chalk.cyan('3. Eliminar Proyecto'), value: '3' },
        { name: chalk.cyan('4. Registro de Avances'), value: '4' },
        { name: chalk.cyan('5. Clonar Proyecto'), value: '5' },
        { name: chalk.red('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
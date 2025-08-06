import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenuPropuesta() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta(`Administrar Propuestas📜`),
      choices: [
        { name: chalk.cyan('1. Crear Propuesta'), value: '1' },
        { name: chalk.cyan('2. Ver Propuestas'), value: '2' },
        { name: chalk.cyan('3. Actualizar Estado de Propuesta'), value: '3' },
        { name: chalk.cyan('4. Eliminar Propuesta'), value: '4' },
        { name: chalk.red('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}


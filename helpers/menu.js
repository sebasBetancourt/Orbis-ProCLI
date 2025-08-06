import inquirer from 'inquirer';
import { mensageMenu } from '../utils/messageMenu.js';
import chalk from 'chalk';

export default async function mostrarMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: `${mensageMenu()}`,
      choices: [
        { name: chalk.yellow.italic('1. Administar Clientes'), value: '1' },
        { name: chalk.yellow.italic('2. Administar Propuestas'), value: '2' },
        { name: chalk.yellow.italic('3. Administar Proyectos'), value: '3' },
        { name: chalk.yellow.italic('4. Administar Contratos'), value: '4' },
        { name: chalk.yellow.italic('5. Administar Entregables'), value: '5' },
        { name: chalk.yellow.italic('6. Administar Gestion Financiera'), value: '6' },
        { name: chalk.yellow.italic('7. Estado Financiero'), value: '7' },
        { name: chalk.red.italic('0. Salir'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
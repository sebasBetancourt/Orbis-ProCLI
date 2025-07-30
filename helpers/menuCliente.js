import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenuCliente() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta(`Administrar Clientes⚙️​`),
      choices: [
        { name: chalk.cyan('1. Registrar Cliente'), value: '1' },
        { name: chalk.cyan('2. Ver Clientes'), value: '2' },
        { name: chalk.cyan('3. Editar Cliente'), value: '3' },
        { name: chalk.cyan('4. Eliminar Cliente'), value: '4' },
        { name: chalk.red('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
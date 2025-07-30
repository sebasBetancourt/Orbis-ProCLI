import inquirer from 'inquirer';
import chalk from 'chalk';

export default async function mostrarMenuCliente() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: chalk.bold.bgMagenta(`Administrar Clientes⚙️​`),
      choices: [
        { name: ('1. Registrar Cliente'), value: '1' },
        { name: ('2. Ver Clientes'), value: '2' },
        { name: ('3. Editar Cliente'), value: '3' },
        { name: ('4. Eliminar Cliente'), value: '4' },
        { name: ('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
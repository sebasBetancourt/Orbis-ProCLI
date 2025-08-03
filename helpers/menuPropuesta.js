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
        { name: chalk.cyan('3. Editar Estado de Propuesta'), value: '3' },
        { name: chalk.green('4. Aceptar Propuesta y Generar Proyecto'), value: '4' }, // Opción de la transacción
        { name: chalk.red('5. Eliminar Propuesta'), value: '5' },
        { name: chalk.red('0. Atras'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
import inquirer from 'inquirer';
import chalk from 'chalk';
import { seleccionarClientePaginado } from '../helpers/seleccionarClientePaginado.js';

export async function pedirDatosPropuesta(clienteModel) {
  console.log(chalk.blue('Ingresando datos de la propuesta...'));

  const clienteSeleccionado = await seleccionarClientePaginado(clienteModel, 'Selecciona el cliente para la propuesta:');
  if (!clienteSeleccionado) {
    console.log(chalk.red('No se seleccionó ningún cliente. Cancelando creación de propuesta.'));
    return null;
  }

  const clienteId = clienteSeleccionado._id.toString();
  const clienteNombre = clienteSeleccionado.nombre;

  const { descripcion, precio, plazo } = await inquirer.prompt([
    {
      type: 'input',
      name: 'descripcion',
      message: chalk.cyan('Ingresa la descripción de la propuesta 📝: '),
      validate: input => {
        if (!input.trim()) return chalk.red.bold('La descripción no puede estar vacía');
        return true;
      },
    },
    {
      type: 'input',
      name: 'precio',
      message: chalk.cyan('Ingresa el precio de la propuesta 💰: '),
      validate: input => {
        const precioNum = parseFloat(input);
        if (isNaN(precioNum) || precioNum <= 0) return chalk.red.bold('El precio debe ser un número mayor a 0');
        return true;
      },
    },
    {
      type: 'input',
      name: 'plazo',
      message: chalk.cyan('Ingresa el plazo en días 📅: '),
      validate: input => {
        const plazoNum = parseInt(input);
        if (isNaN(plazoNum) || plazoNum <= 0) return chalk.red.bold('El plazo debe ser un número mayor a 0');
        return true;
      },
    },
  ]);

  return {
    clienteId,
    descripcion,
    precio: parseFloat(precio),
    plazo: parseInt(plazo),
    clienteNombre,
  };
}
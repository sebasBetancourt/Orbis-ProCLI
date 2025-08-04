import inquirer from "inquirer";
import chalk from "chalk";

export async function datosTransaccion(proyectoIdPorDefecto = null) {
  // Solicitar proyectoId si no se proporciona
  let proyectoId = proyectoIdPorDefecto;
  
  if (!proyectoId) {
    const { proyectoId: inputProyectoId } = await inquirer.prompt([
      {
        type: 'input',
        name: 'proyectoId',
        message: 'Ingresa el ID del proyecto 🆔:',
        validate: input => {
          if (!input.trim()) {
            return chalk.red.bold("El ID del proyecto no puede estar vacío.");
          }
          if (input.length < 3) {
            return chalk.red.bold("El ID del proyecto debe tener al menos 3 caracteres.");
          }
          return true;
        }
      }
    ]);
    proyectoId = inputProyectoId.trim();
  }

  const { fecha } = await inquirer.prompt([
    {
      type: 'input',
      name: 'fecha',
      message: 'Ingresa la fecha de la transacción (YYYY-MM-DD): 📅',
      validate: input => {
        const regex = /^\d{4}-\d{2}-\d{2}$/;
        const date = new Date(input);
        if (!regex.test(input)) {
          return chalk.red.bold("Formato inválido. Usa YYYY-MM-DD.");
        } else if (isNaN(date.getTime())) {
          return chalk.red.bold("La fecha no es válida.");
        }
        return true;
      }
    }
  ]);

  const { tipo } = await inquirer.prompt([
    {
      type: 'list',
      name: 'tipo',
      message: 'Selecciona el tipo de transacción:',
      choices: ['ingreso', 'egreso']
    }
  ]);

  const { monto } = await inquirer.prompt([
    {
      type: 'input',
      name: 'monto',
      message: `Ingresa el monto del ${tipo === "ingreso" ? "ingreso" : "egreso"} 💰:`,
      validate: input => {
        const numero = parseFloat(input);
        if (!input.trim()) {
          return chalk.red.bold("El monto no puede estar vacío.");
        } else if (isNaN(numero) || numero <= 0) {
          return chalk.red.bold("Debes ingresar un número válido y positivo.");
        }
        return true;
      }
    }
  ]);

  const { descripcion } = await inquirer.prompt([
    {
      type: 'input',
      name: 'descripcion',
      message: 'Describe brevemente la transacción 📝:',
      validate: input => {
        if (!input.trim()) {
          return chalk.red.bold("La descripción no puede estar vacía.");
        } else if (input.length < 3) {
          return chalk.red.bold("La descripción debe tener al menos 3 caracteres.");
        }
        return true;
      }
    }
  ]);

  // Convertir monto a número
  const montoNumerico = parseFloat(monto);

  return {
    proyectoId,
    fecha,
    tipo,
    monto: montoNumerico,
    descripcion: descripcion.trim()
  };
}
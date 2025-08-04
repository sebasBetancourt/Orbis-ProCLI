import inquirer from 'inquirer';
import chalk from 'chalk';

export async function datosContrato() {
  // Pedir proyectoId (string que luego en modelo se convierte a ObjectId)
const { proyectoId } = await inquirer.prompt({
    type: 'input',
    name: 'proyectoId',
    message: 'Ingresa el ID del proyecto (ObjectId):',
    validate: input => {
    if (!input.trim()) return chalk.red('El proyectoId es obligatorio');
    if (!/^[a-fA-F0-9]{24}$/.test(input.trim()))
        return chalk.red('El proyectoId debe ser un ObjectId válido (24 caracteres hexadecimales)');
    return true;
    }
});

  // Pedir condiciones (string obligatorio no vacío)
const { condiciones } = await inquirer.prompt({
    type: 'input',
    name: 'condiciones',
    message: 'Ingresa las condiciones del contrato:',
    validate: input => {
    if (!input.trim()) return chalk.red('Las condiciones no pueden estar vacías');
    return true;
    }
});

  // Pedir fechaInicio (opcional), si vacío se usará la fecha actual en el modelo
const { fechaInicio } = await inquirer.prompt({
    type: 'input',
    name: 'fechaInicio',
    message: 'Ingresa la fecha de inicio (YYYY-MM-DD) o deja vacío para hoy:',
    validate: input => {
      if (!input.trim()) return true; // vacío válido
      // Validar formato básico
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.trim()))
        return chalk.red('Fecha inválida, debe ser formato YYYY-MM-DD');
    return true;
    }
});
  // Pedir fechaFin (opcional)
const { fechaFin } = await inquirer.prompt({
    type: 'input',
    name: 'fechaFin',
    message: 'Ingresa la fecha de fin (YYYY-MM-DD) o deja vacío:',
    validate: input => {
    if (!input.trim()) return true;
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.trim()))
        return chalk.red('Fecha inválida, debe ser formato YYYY-MM-DD');
    return true;
    }
});

  // Pedir valorTotal (obligatorio, número mayor que cero)
const { valorTotal } = await inquirer.prompt({
    type: 'input',
    name: 'valorTotal',
    message: 'Ingresa el valor total del contrato:',
    validate: input => {
    const valor = Number(input);
    if (isNaN(valor) || valor <= 0) return chalk.red('Debe ingresar un número mayor que 0');
    return true;
    }
});

return {
    proyectoId: proyectoId.trim(),
    condiciones: condiciones.trim(),
    fechaInicio: fechaInicio.trim() || null,
    fechaFin: fechaFin.trim() || null,
    valorTotal: Number(valorTotal)
};
}

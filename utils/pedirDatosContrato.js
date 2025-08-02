import inquirer from 'inquirer';
import chalk from 'chalk';

export async function datosContrato() {
const respuestas = {};

  // proyectoId - obligatorio, debe ser un string que represente ObjectId
const { proyectoId } = await inquirer.prompt({
    type: 'input',
    name: 'proyectoId',
    message: 'Ingresa el ID del proyecto (ObjectId):',
    validate: input => {
    if (!input.trim()) return chalk.red('El proyectoId es obligatorio');
      // Opcional: validar formato ObjectId (24 caracteres hexadecimales)
    if (!/^[a-fA-F0-9]{24}$/.test(input.trim()))
        return chalk.red('El proyectoId debe ser un ObjectId válido de 24 caracteres hexadecimales');
    return true;
    }
});
respuestas.proyectoId = proyectoId.trim();

  // condiciones - obligatorio string no vacío
const { condiciones } = await inquirer.prompt({
    type: 'input',
    name: 'condiciones',
    message: 'Ingresa las condiciones del contrato:',
    validate: input => {
    if (!input.trim()) return chalk.red('Las condiciones no pueden estar vacías');
    return true;
    }
});
respuestas.condiciones = condiciones.trim();

  // fechaInicio - opcional, si no se ingresa usar fecha actual
const { fechaInicio } = await inquirer.prompt({
    type: 'input',
    name: 'fechaInicio',
    message: 'Ingresa la fecha de inicio (YYYY-MM-DD) o deja vacío para hoy:',
    validate: input => {
    if (!input.trim()) return true;
      // Validar formato básico YYYY-MM-DD
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.trim()))
        return chalk.red('Fecha inválida, debe ser formato YYYY-MM-DD');
    return true;
    }
});
respuestas.fechaInicio = fechaInicio.trim() || new Date().toISOString().slice(0, 10);

  // fechaFin - opcional, puede estar vacía
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
respuestas.fechaFin = fechaFin.trim() || null;

  // valorTotal - obligatorio número mayor que 0
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
respuestas.valorTotal = Number(valorTotal);

  // estado - opcional, con valores posibles
const { estado } = await inquirer.prompt({
    type: 'list',
    name: 'estado',
    message: 'Selecciona el estado del contrato:',
    choices: ['activo', 'finalizado', 'cancelado'],
    default: 'activo'
});
respuestas.estado = estado;

  // cláusulas - pediremos una lista simple de cláusulas separadas por comas
const { clausulas } = await inquirer.prompt({
    type: 'input',
    name: 'clausulas',
    message: 'Ingresa cláusulas separadas por coma (,):',
});
respuestas.clausulas = clausulas
    .split(',')
    .map(c => c.trim())
    .filter(c => c.length > 0);

  // formaPago - texto libre opcional
const { formaPago } = await inquirer.prompt({
    type: 'input',
    name: 'formaPago',
    message: 'Ingresa la forma de pago (opcional):',
});
respuestas.formaPago = formaPago.trim() || null;

  // firmado - booleano
const { firmado } = await inquirer.prompt({
    type: 'confirm',
    name: 'firmado',
    message: '¿El contrato está firmado?',
    default: false
});
respuestas.firmado = firmado;

  // fechaFirma - solo si firmado es true, opcional
if (firmado) {
    const { fechaFirma } = await inquirer.prompt({
    type: 'input',
    name: 'fechaFirma',
    message: 'Ingresa la fecha de firma (YYYY-MM-DD):',
    validate: input => {
        if (!input.trim()) return chalk.red('La fecha de firma es obligatoria si el contrato está firmado');
        if (!/^\d{4}-\d{2}-\d{2}$/.test(input.trim()))
        return chalk.red('Fecha inválida, debe ser formato YYYY-MM-DD');
        return true;
    }
    });
    respuestas.fechaFirma = fechaFirma.trim();
} else {
    respuestas.fechaFirma = null;
}

  // firmadoPor - pedimos nombre y rol si firmado es true
if (firmado) {
    const { nombreFirmadoPor, rolFirmadoPor } = await inquirer.prompt([
    {
        type: 'input',
        name: 'nombreFirmadoPor',
        message: 'Nombre de quien firmó el contrato:',
        validate: input => input.trim() ? true : chalk.red('El nombre es obligatorio')
    },
    {
        type: 'input',
        name: 'rolFirmadoPor',
        message: 'Rol de quien firmó el contrato:',
        validate: input => input.trim() ? true : chalk.red('El rol es obligatorio')
    }
    ]);
    respuestas.firmadoPor = {
    nombre: nombreFirmadoPor.trim(),
    rol: rolFirmadoPor.trim()
    };
} else {
    respuestas.firmadoPor = null;
}
  // observaciones - texto libre opcional
const { observaciones } = await inquirer.prompt({
    type: 'input',
    name: 'observaciones',
    message: 'Observaciones adicionales (opcional):',
});
respuestas.observaciones = observaciones.trim() || null;

return respuestas;
}

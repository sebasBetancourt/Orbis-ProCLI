import { Comando } from "./comando.js";
import { contratoModel } from "../../models/Contratos.js";
import { seleccionarContratoPaginado } from "../../utils/seleccionContrato.js";
import { datosContrato } from "../../utils/pedirDatosContrato.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class ActualizarContratoComando extends Comando {
async ejecutar() {
    const ContratoModel = await contratoModel();
    const contratoSeleccionado = await seleccionarContratoPaginado(ContratoModel, 'Selecciona un contrato para editar:');

    if (!contratoSeleccionado) {
    console.log(chalk.yellow("\nOperación cancelada.❌\n"));
    return;
    }

    const nuevosDatos = await datosContrato();

    await ContratoModel.updateOne(
    { _id: contratoSeleccionado._id },
    { $set: nuevosDatos }
    );

    console.log(chalk.green("Contrato actualizado exitosamente ✅"));

    await inquirer.prompt([
    {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
    },
    ]);
}
}

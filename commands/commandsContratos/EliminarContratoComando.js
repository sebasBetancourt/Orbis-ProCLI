import { Comando } from "./comando.js";
import { contratoModel } from "../../models/Contratos.js";
import { seleccionarContratoPaginado } from "../../utils/seleccionContrato.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class EliminarContratoComando extends Comando {
async ejecutar() {
    const ContratoModel = await contratoModel();
    const contratoSeleccionado = await seleccionarContratoPaginado(ContratoModel, 'Selecciona un contrato para eliminar 🔴:');

    if (!contratoSeleccionado) {
    console.log(chalk.yellow("\nOperación cancelada.❌\n"));
    return;
    }

    const { confirmDelete } = await inquirer.prompt([
    {
        type: 'confirm',
        name: 'confirmDelete',
        message: chalk.bgRed('¿Estás seguro de que deseas eliminar este contrato? ⚠️'),
    },
    ]);

    if (confirmDelete) {
    await ContratoModel.deleteOne({ _id: contratoSeleccionado._id });
    console.log(chalk.green("Contrato eliminado exitosamente ✅"));
    } else {
    console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
    }

    await inquirer.prompt([
    {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
    },
    ]);
}
}

import { Comando } from "./comando.js";
import { contratoModel } from "../../models/Contratos.js";
import { seleccionarContratoPaginado } from "../../utils/seleccionContrato.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class ListarContratoComando extends Comando {
async ejecutar() {
    const ContratoModel = await contratoModel();

    const contratoSeleccionado = await seleccionarContratoPaginado(
    ContratoModel,
    "Selecciona un contrato para ver más detalles:"
    );

    if (!contratoSeleccionado) {
    return;
    }

    console.log(chalk.green.bold("\nDetalles del Contrato:\n"));
    console.log(`${chalk.bold("Proyecto ID:")} ${contratoSeleccionado.proyectoId.toString()}`);
    console.log(`${chalk.bold("Condiciones:")} ${contratoSeleccionado.condiciones}`);
    console.log(`${chalk.bold("Fecha Inicio:")} ${new Date(contratoSeleccionado.fechaInicio).toLocaleDateString()}`);
    console.log(`${chalk.bold("Fecha Fin:")} ${contratoSeleccionado.fechaFin ? new Date(contratoSeleccionado.fechaFin).toLocaleDateString() : "No especificada"}`);
    console.log(`${chalk.bold("Valor Total:")} $${contratoSeleccionado.valorTotal}`);

    await inquirer.prompt([
    {
        type: "input",
        name: "continuar",
        message: chalk.blueBright("\nPresiona Enter para continuar..."),
    },
    ]);
}
}

import { Comando } from "./comando.js";
import { Contrato, contratoModel, MostrarContrato } from "../../models/Contratos.js";
import { datosContrato } from "../../utils/pedirDatosContrato.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class CrearContratoComando extends Comando {
async ejecutar() {
    try {
    const { proyectoId, condiciones, fechaInicio, fechaFin, valorTotal } = await datosContrato();

    const ContratoModel = await contratoModel();
    const contrato = new Contrato({
        proyectoId,
        condiciones,
        fechaInicio: fechaInicio ? new Date(fechaInicio) : undefined,
        fechaFin: fechaFin ? new Date(fechaFin) : undefined,
        valorTotal: Number(valorTotal),
    });

    await ContratoModel.insertOne(contrato);

    const mostrar = new MostrarContrato();
    mostrar.mostrar(contrato);

    console.log(chalk.green("Contrato agregado exitosamente ✅"));

    } catch (error) {
    console.log(chalk.red(`❌ Error al crear el contrato: ${error.message}`));
    }

    await inquirer.prompt([
    {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para continuar...'),
    },
    ]);
}
}

import { Comando } from "./comando.js";
import { transaccionModel } from "../../models/Transacciones.js";
import { seleccionarTransaccionPaginado } from "../../utils/seleccionTransaccion.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class ListarTransaccionComando extends Comando {
async ejecutar() {
    const TransaccionModel = await transaccionModel();

    const transaccionSeleccionada = await seleccionarTransaccionPaginado(
    TransaccionModel,
    "Selecciona una transacción para ver más detalles:"
    );

    if (!transaccionSeleccionada) {
    return;
    }

    console.log(chalk.green.bold("\nDetalles de la Transacción:\n"));
    console.log(`${chalk.bold("ID:")} ${transaccionSeleccionada._id}`);
    console.log(`${chalk.bold("Fecha:")} ${new Date(transaccionSeleccionada.fecha).toLocaleDateString()}`);
    console.log(`${chalk.bold("Tipo:")} ${transaccionSeleccionada.tipo}`);
    console.log(`${chalk.bold("Monto:")} $${transaccionSeleccionada.monto}`);
    console.log(`${chalk.bold("Descripción:")} ${transaccionSeleccionada.descripcion || "Sin descripción"}`);

    await inquirer.prompt([
    {
        type: "input",
        name: "continuar",
        message: chalk.blueBright("\nPresiona Enter para continuar..."),
    },
    ]);
}
}

import { Comando } from "./comando.js";
import { transaccionModel } from "../../models/Transacciones.js";
import { seleccionarTransaccionPaginado } from "../../utils/seleccionTransaccion.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class EliminarTransaccionComando extends Comando {
async ejecutar() {
    const TransaccionModel = await transaccionModel();
    const transaccionSeleccionada = await seleccionarTransaccionPaginado(
    TransaccionModel,
    "Selecciona una transacción para eliminar 🔴:"
    );

    if (!transaccionSeleccionada) {
    console.log(chalk.yellow("\nOperación cancelada.❌\n"));
    return;
    }

    const { confirmDelete } = await inquirer.prompt([
    {
        type: "confirm",
        name: "confirmDelete",
        message: chalk.bgRed("¿Estás seguro de que deseas eliminar esta transacción? ⚠️"),
    },
    ]);

    if (confirmDelete) {
    await TransaccionModel.deleteOne({ _id: transaccionSeleccionada._id });
    console.log(chalk.green("Transacción eliminada exitosamente ✅"));
    } else {
    console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
    }

    await inquirer.prompt([
    {
        type: "input",
        name: "continuar",
        message: chalk.blueBright("\nPresiona Enter para regresar al menú..."),
    },
    ]);
}
}


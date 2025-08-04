import { Comando } from "./comando.js";
import { entregableModel } from "../../models/Entregables.js";
import { seleccionarEntregablePaginado } from "../../utils/seleccionEntregable.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class EliminarEntregableComando extends Comando {
async ejecutar() {
    const EntregableModel = await entregableModel();
    const entregableSeleccionado = await seleccionarEntregablePaginado(
    EntregableModel,
    "Selecciona un entregable para eliminar 🔴:"
    );

    if (!entregableSeleccionado) {
    console.log(chalk.yellow("\nOperación cancelada.❌\n"));
    return;
    }

    const { confirmDelete } = await inquirer.prompt([
    {
        type: "confirm",
        name: "confirmDelete",
        message: chalk.bgRed(
        "¿Estás seguro de que deseas eliminar este entregable? ⚠️"
        ),
    },
    ]);

    if (confirmDelete) {
    await EntregableModel.deleteOne({ _id: entregableSeleccionado._id });
    console.log(chalk.green("Entregable eliminado exitosamente ✅"));
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

import { Comando } from "./comando.js";
import { Transaccion, transaccionModel, MostrarTransaccion } from "../../models/Transacciones.js";
import { datosTransaccion } from "../../utils/pedirDatosTransaccion.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class CrearTransaccionComando extends Comando {
async ejecutar() {
    try {
    const { fecha, tipo, monto, descripcion } = await datosTransaccion();

    const TransaccionModel = await transaccionModel();

    const transaccion = new Transaccion({
        fecha: new Date(fecha),
        tipo,
        monto: Number(monto),
        descripcion
    });

    await TransaccionModel.insertOne(transaccion);

    const mostrar = new MostrarTransaccion();
    mostrar.mostrar(transaccion);

    console.log(chalk.green("✅ Transacción registrada correctamente."));

    } catch (error) {
    console.log(chalk.red(`❌ Error al crear la transacción: ${error.message}`));
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

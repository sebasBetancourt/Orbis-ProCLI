import { Comando } from "./Comando.js";
import { clienteModel } from "../../models/Cliente.js";
import { seleccionarClientePaginado } from "../../utils/seleccionCliente.js";
import {datosCliente} from '../../utils/pedirDatosCliente.js'
import chalk from "chalk";
import inquirer from "inquirer";

export class ActualizarClienteComando extends Comando{
    async ejecutar(){
        const ClienteModel = await clienteModel();
        const clienteSeleccionado = await seleccionarClientePaginado(ClienteModel, 'Selecciona un cliente para editar:');

        if (!clienteSeleccionado) {
          console.log(chalk.yellow("\nOperación cancelada.❌\n"));
          return;
        }

        const { nombreCliente, emailCliente, telefonoCliente, empresaCliente } = await datosCliente();
        await ClienteModel.updateOne(
          { _id: clienteSeleccionado._id },
          { $set: { nombre: nombreCliente, email: emailCliente, telefono: telefonoCliente, empresaCliente } }
        );

        console.log(chalk.green("Cliente Actualizado exitosamente✅"));

        await inquirer.prompt([
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
          },
        ]);
    }
}
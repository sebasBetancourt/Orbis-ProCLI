import { Comando } from "./Comando.js";
import { clienteModel } from "../models/Cliente.js";
import { seleccionarClientePaginado } from "../utils/seleccionCliente.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class ListarClienteComando extends Comando{
    async ejecutar(){
        const ClienteModel = await clienteModel();
        const clienteSeleccionado = await seleccionarClientePaginado(ClienteModel, 'Selecciona un cliente para ver más detalles:');
        
        if (!clienteSeleccionado) {
          return;
        }

        console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
        console.log(`${chalk.bold("Nombre:")} ${clienteSeleccionado.nombre}`);
        console.log(`${chalk.bold("Email:")} ${clienteSeleccionado.email}`);
        console.log(`${chalk.bold("Teléfono:")} ${clienteSeleccionado.telefono}`);
        console.log(`${chalk.bold("Empresa Asociada:")} ${clienteSeleccionado.empresa}`);

        await inquirer.prompt([
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('\nPresiona Enter para continuar...'),
          },
        ]);
    }
}
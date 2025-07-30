import { Comando } from "./Comando.js";
import { Client, clienteModel, mostrarCliente } from "../models/Cliente.js";
import { datosCliente } from "../utils/pedirDatosCliente.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class CrearClienteComando extends Comando{
    async ejecutar(){
        const { nombreCliente, emailCliente, telefonoCliente, empresaCliente } = await datosCliente();
        const ClienteModel = await clienteModel();
        const cliente = new Client(nombreCliente, emailCliente, telefonoCliente, empresaCliente);
        await ClienteModel.insertOne(cliente);
        const mostrar = new mostrarCliente()
        console.log(mostrar.mostrar(cliente));
        console.log(chalk.green("Cliente Agregado Exitosamente✅"));
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('\nPresiona Enter para continuar...'),
          },
        ]);
    }
}
import { Client, clienteModel } from "../models/Cliente.js";
import inquirer from 'inquirer';
import { connection } from "../config/db.js";
import chalk from "chalk";
import { datosCliente } from "../helpers/pedirDatosCliente.js";

export class ClienteService{

    async crearCliente(){
        const { nombreCliente, emailCliente, telefonoCliente } = datosCliente()
        const ClienteModel = await clienteModel();
        const cliente = new Client(nombreCliente, emailCliente, telefonoCliente)
        await ClienteModel.insertOne(cliente);
        console.log(cliente.mostrarCliente());
        console.log("Cliente Agregado Exitosamente✅"); 
        await inquirer.prompt([
            {
              type: 'input',
              name: 'continuar',
              message: chalk.blueBright('\nPresiona Enter para continuar...'),
            }
          ]);
    }


    async listarCliente() {
        const ClienteModel = await clienteModel();
        const clientes = await ClienteModel.find().toArray(); 
      
        console.log(chalk.yellow.bold("\nLista de Clientes:\n"));
        clientes.forEach((cliente, index) => {
          console.log(`${index + 1}. ${cliente.nombre} - ${cliente.email} - ${cliente.telefono}`);
        });
      
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('\nPresiona Enter para continuar...'),
          }
        ]);
      }
      

}



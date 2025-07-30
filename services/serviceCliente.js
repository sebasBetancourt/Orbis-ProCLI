import { Client, clienteModel } from "../models/Cliente.js";
import inquirer from 'inquirer';
import { connection } from "../config/db.js";
import chalk from "chalk";
import { datosCliente } from "../utils/pedirDatosCliente.js";

export class ClienteService{

    async crearCliente(){
        const { nombreCliente, emailCliente, telefonoCliente } = await datosCliente()
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
    };


    async listarCliente() {
      const ClienteModel = await clienteModel();
      const clientes = await ClienteModel.find().toArray();

      if (clientes.length === 0) {
        console.log(chalk.red.bold("\nNo hay clientes registrados.\n"));
        return;
      }

      const opciones = clientes.map((cliente, index) => ({
        name: `${index + 1}. ${cliente.nombre}`,
        value: cliente
      }));

      const { clienteSeleccionado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'clienteSeleccionado',
          message: chalk.yellow('Selecciona un cliente para ver más detalles:'),
          choices: opciones
        }
      ]);

      console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
      console.log(`${chalk.bold("Nombre:")} ${clienteSeleccionado.nombre}`);
      console.log(`${chalk.bold("Email:")} ${clienteSeleccionado.email}`);
      console.log(`${chalk.bold("Teléfono:")} ${clienteSeleccionado.telefono}`);
      console.log(`${chalk.bold("ID:")} ${clienteSeleccionado._id}`);

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
        }
      ]);
    } 
    

    async actualizarCliente(){




    };

    async eliminarCliente(){

    };
      

}



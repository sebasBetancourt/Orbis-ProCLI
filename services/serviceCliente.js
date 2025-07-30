import { Client, clienteModel } from "../models/Cliente.js";
import inquirer from 'inquirer';
import chalk from "chalk";
import { datosCliente } from "../utils/pedirDatosCliente.js";
import { seleccionarClientePaginado } from "../utils/seleccionCliente.js";

export class ClienteService {
  async crearCliente() {
    const { nombreCliente, emailCliente, telefonoCliente, empresaCliente } = await datosCliente();
    const ClienteModel = await clienteModel();
    const cliente = new Client(nombreCliente, emailCliente, telefonoCliente, empresaCliente);
    await ClienteModel.insertOne(cliente);
    console.log(cliente.mostrarCliente());
    console.log(chalk.green("Cliente Agregado Exitosamente✅"));
    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para continuar...'),
      },
    ]);
  }

  async listarCliente() {
    const ClienteModel = await clienteModel();
    const clienteSeleccionado = await seleccionarClientePaginado(ClienteModel, 'Selecciona un cliente para ver más detalles:');
    
    if (!clienteSeleccionado) {
      return;
    }

    console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
    console.log(`${chalk.bold("Nombre:")} ${clienteSeleccionado.nombre}`);
    console.log(`${chalk.bold("Email:")} ${clienteSeleccionado.email}`);
    console.log(`${chalk.bold("Teléfono:")} ${clienteSeleccionado.telefono}`);
    console.log(`${chalk.bold("Empresa Asociada:")} ${clienteSeleccionado.empresaCliente}`);

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para continuar...'),
      },
    ]);
  }

  async actualizarCliente() {
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

  async eliminarCliente() {
    const ClienteModel = await clienteModel();
    const clienteSeleccionado = await seleccionarClientePaginado(ClienteModel, 'Selecciona un cliente para eliminar🔴:');

    if (!clienteSeleccionado) {
      console.log(chalk.yellow("\nOperación cancelada.❌\n"));
      return;
    }

    const { confirmDelete } = await inquirer.prompt([
      {
        type: 'confirm',
        name: 'confirmDelete',
        message: chalk.bgRed('¿Estás seguro de que deseas eliminar este cliente? ⚠️'),
      },
    ]);

    if (confirmDelete) {
      await ClienteModel.deleteOne({ _id: clienteSeleccionado._id });
      console.log(chalk.green("Cliente Eliminado exitosamente✅"));
    } else {
      console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
      },
    ]);
  }
}
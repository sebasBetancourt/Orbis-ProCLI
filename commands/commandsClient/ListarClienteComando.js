import { Comando } from "./Comando.js";
import { clienteModel } from "../../models/Cliente.js";
import { proyectoModel } from "../../models/Proyectos.js";
import { seleccionarClientePaginado } from "../../utils/seleccionCliente.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class ListarClienteComando extends Comando {
  async ejecutar() {
    try {
      const ClienteModel = await clienteModel();
      const ProyectoModel = await proyectoModel();
      const clienteSeleccionado = await seleccionarClientePaginado(ClienteModel, 'Selecciona un cliente para ver más detalles:');

      if (!clienteSeleccionado) {
        console.log(chalk.red.bold('Selección inválida'));
        return;
      }

      console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
      console.log(`${chalk.bold("Nombre:")} ${clienteSeleccionado.nombre}`);
      console.log(`${chalk.bold("Email:")} ${clienteSeleccionado.email}`);
      console.log(`${chalk.bold("Teléfono:")} ${clienteSeleccionado.telefono}`);
      console.log(`${chalk.bold("Empresa Asociada:")} ${clienteSeleccionado.empresa}`);

      
      const proyectos = await ProyectoModel.find({ clienteId: clienteSeleccionado._id }).toArray();

      console.log(chalk.green.bold("Proyectos Asociados:"));
      if (proyectos.length === 0) {
        console.log(chalk.yellow("No hay proyectos asociados a este cliente."));
      } else {
        proyectos.forEach((proyecto, index) => {
          console.log(`${chalk.bold(index + 1, "Proyecto:")} ${proyecto.nombre}`);
        });
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al listar los detalles del cliente: ${error.message}`));
    }
  }
}
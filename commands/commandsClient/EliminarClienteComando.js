import { Comando } from "./Comando.js";
import { clienteModel } from "../../models/Cliente.js";
import { seleccionarClientePaginado } from "../../utils/seleccionCliente.js";
import chalk from "chalk";
import inquirer from "inquirer";

export class EliminarClienteComando extends Comando{
    async ejecutar(){
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
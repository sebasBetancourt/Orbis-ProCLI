import { Comando } from "./Comando.js";
import { clienteModel } from "../../models/Cliente.js";
import { propuestaModel } from "../../models/Propuestas.js";
import { proyectoModel } from "../../models/Proyectos.js";
import { contratoModel } from "../../models/Contratos.js";
import { finanzaModel } from "../../models/Finanzas.js";
import { seleccionarClientePaginado } from "../../utils/seleccionCliente.js";
import { ObjectId } from "mongodb";
import chalk from "chalk";
import inquirer from "inquirer";

export class EliminarClienteComando extends Comando {
  async ejecutar() {
    try {
      const clienteCollection = await clienteModel();
      const propuestaCollection = await propuestaModel();
      const proyectoCollection = await proyectoModel();
      const contratoCollection = await contratoModel();
      const finanzaCollection = await finanzaModel();

      const clienteSeleccionado = await seleccionarClientePaginado(clienteCollection, 'Selecciona un cliente para eliminar🔴:');

      if (!clienteSeleccionado) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
      }

      const { confirmDelete } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: chalk.bgRed('¿Estás seguro de que deseas eliminar este cliente y todos sus datos asociados (propuestas, proyectos, contratos, finanzas)? ⚠️'),
        },
      ]);

      if (!confirmDelete) {
        console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
        return;
      }

      const session = clienteCollection.client.startSession();
      try {
        await session.withTransaction(async () => {
          // Obtener proyectos asociados al cliente
          const proyectos = await proyectoCollection.find({ clienteId: new ObjectId(clienteSeleccionado._id) }, { session }).toArray();
          const proyectoIds = proyectos.map((p) => p._id);

          // Eliminar registros financieros asociados a los proyectos
          await finanzaCollection.deleteMany({ proyectoId: { $in: proyectoIds } }, { session });

          // Eliminar contratos asociados a los proyectos
          await contratoCollection.deleteMany({ proyectoId: { $in: proyectoIds } }, { session });

          // Eliminar proyectos
          await proyectoCollection.deleteMany({ clienteId: new ObjectId(clienteSeleccionado._id) }, { session });

          // Eliminar propuestas
          await propuestaCollection.deleteMany({ clienteId: new ObjectId(clienteSeleccionado._id) }, { session });

          // Eliminar cliente
          const resultado = await clienteCollection.deleteOne({ _id: new ObjectId(clienteSeleccionado._id) }, { session });

          if (resultado.deletedCount === 0) {
            throw new Error('Cliente no encontrado');
          }
        });

        console.log(chalk.green("Cliente y todos sus datos asociados eliminados exitosamente ✅"));
      } finally {
        await session.endSession();
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al eliminar cliente: ${error.message}`));
    }
  }
}
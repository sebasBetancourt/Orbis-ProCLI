import { proyectoModel } from '../../models/Proyectos.js';
import { clienteModel } from '../../models/Cliente.js';
import { seleccionarProyectoPaginado } from '../../utils/seleccionProyecto.js';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ListarProyectosComando {
  async ejecutar() {
    try {
      const ProyectoModel = await proyectoModel();
      const proyectoSeleccionado = await seleccionarProyectoPaginado(
        ProyectoModel,
        'Selecciona un proyecto para ver más detalles:'
      );

      if (!proyectoSeleccionado) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
      }

      const ClienteModel = await clienteModel();
      const cliente = await ClienteModel.findOne({ _id: proyectoSeleccionado.clienteId });
      const nombreCliente = cliente ? cliente.nombre : 'Cliente no encontrado';

      console.log(chalk.green.bold("\nDetalles del Proyecto:\n"));
      console.log(chalk.cyan(`Nombre: ${proyectoSeleccionado.nombre}`));
      console.log(`Cliente: ${nombreCliente}`);
      console.log(`Estado: ${proyectoSeleccionado.estado}`);
      console.log(`Avances: ${proyectoSeleccionado.avances}%`);
      console.log(chalk.bold("Contrato:"));
      if (typeof proyectoSeleccionado.contrato === 'object' && proyectoSeleccionado.contrato !== null) {
        console.log(`  Fecha de Inicio: ${new Date(proyectoSeleccionado.contrato.fechaInicio).toLocaleDateString()}`);
        console.log(`  Fecha de Fin: ${new Date(proyectoSeleccionado.contrato.fechaFin).toLocaleDateString()}`);
        console.log(`  Valor Total: $${proyectoSeleccionado.contrato.valorTotal}`);
        console.log(`  Condiciones: ${proyectoSeleccionado.contrato.condiciones}`);
      } else {
        console.log(`  Pendiente`);
      }
      console.log(chalk.bold("Entregables:"));
      if (Array.isArray(proyectoSeleccionado.entregables) && proyectoSeleccionado.entregables.length > 0) {
        proyectoSeleccionado.entregables.forEach((entregable, i) => {
          console.log(`  ${i + 1}. ${entregable.titulo}`);
          console.log(`     Fecha Límite: ${new Date(entregable.fechaLimite).toLocaleDateString()}`);
          console.log(`     Estado: ${entregable.estado}`);
        });
      } else {
        console.log(`  Pendiente`);
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al listar los proyectos: ${error.message}`));
      throw new Error("Error en el comando para listar proyectos.");
    }
  }
}
import { Proyecto, proyectoModel } from "../models/Proyecto.js";
import inquirer from 'inquirer';
import chalk from "chalk";
import { seleccionarDocumentoPaginado } from "../utils/seleccionDocumento.js";
import { datosProyecto } from "../utils/pedirDatosProyecto.js";
import { datosAvance } from "../utils/pedirDatosAvance.js";
import { ObjectId } from 'mongodb';

export class ProyectoService {
  async getCollection() {
    return await proyectoModel();
  }

  async createProyecto(proyectoData, session = null) {
      const collection = await this.getCollection();
      const nuevoProyecto = new Proyecto(
          proyectoData.clienteId,
          proyectoData.propuestaId,
          proyectoData.descripcion,
          proyectoData.valor,
          proyectoData.fechaInicio,
          proyectoData.estado,
          proyectoData.avances,
          proyectoData.contratoId
      );
      const result = await collection.insertOne(nuevoProyecto, { session });
      console.log(chalk.green(`\nProyecto "${nuevoProyecto.descripcion}" creado con ID: ${result.insertedId} ✅`));
      return result.insertedId;
  }

  async listarProyectos() {
    const collection = await this.getCollection();
    const proyectoSeleccionado = await seleccionarDocumentoPaginado(collection, 'Selecciona un proyecto para ver más detalles:', 'descripcion');

    if (!proyectoSeleccionado) {
        return;
    }

    console.log(chalk.green.bold("\nDetalles del Proyecto:\n"));
    console.log(`${chalk.bold("ID:")} ${proyectoSeleccionado._id}`);
    console.log(`${chalk.bold("Descripción:")} ${proyectoSeleccionado.descripcion}`);
    console.log(`${chalk.bold("Valor:")} ${proyectoSeleccionado.valor}`);
    console.log(`${chalk.bold("Estado:")} ${proyectoSeleccionado.estado}`);
    console.log(`${chalk.bold("Fecha de Inicio:")} ${proyectoSeleccionado.fechaInicio.toLocaleDateString()}`);
    console.log(`${chalk.bold("Avances:")}`);
    if (proyectoSeleccionado.avances && proyectoSeleccionado.avances.length > 0) {
        proyectoSeleccionado.avances.forEach(avance => {
            console.log(`  - ${avance.fecha.toLocaleDateString()}: ${avance.descripcion}`);
        });
    } else {
        console.log(`  ${chalk.italic("No hay avances registrados.")}`);
    }

    await inquirer.prompt([{
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para continuar...'),
    }]);
  }

  async actualizarProyecto() {
    const collection = await this.getCollection();
    const proyectoSeleccionado = await seleccionarDocumentoPaginado(collection, 'Selecciona un proyecto para editar:', 'descripcion');

    if (!proyectoSeleccionado) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
    }

    const nuevosDatos = await datosProyecto();
    const result = await collection.updateOne(
        { _id: new ObjectId(proyectoSeleccionado._id) },
        { $set: nuevosDatos }
    );
    if (result.modifiedCount > 0) {
        console.log(chalk.green("Proyecto Actualizado exitosamente✅"));
    } else {
        console.log(chalk.yellow("No se realizaron cambios en el proyecto.❌"));
    }

    await inquirer.prompt([{
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
    }]);
  }

  async eliminarProyecto() {
    const collection = await this.getCollection();
    const proyectoSeleccionado = await seleccionarDocumentoPaginado(collection, 'Selecciona un proyecto para eliminar🔴:', 'descripcion');
    
    if (!proyectoSeleccionado) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
    }

    const { confirmDelete } = await inquirer.prompt([{
        type: 'confirm',
        name: 'confirmDelete',
        message: chalk.bgRed('¿Estás seguro de que deseas eliminar este proyecto? ⚠️'),
    }]);

    if (confirmDelete) {
        await collection.deleteOne({ _id: new ObjectId(proyectoSeleccionado._id) });
        console.log(chalk.green("Proyecto Eliminado exitosamente✅"));
    } else {
        console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
    }

    await inquirer.prompt([{
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
    }]);
  }

  async registrarAvanceProyecto() {
    const collection = await this.getCollection();
    const proyectoSeleccionado = await seleccionarDocumentoPaginado(collection, 'Selecciona un proyecto para registrar un avance:', 'descripcion');

    if (!proyectoSeleccionado) {
        console.log(chalk.yellow("\nOperación cancelada.❌\n"));
        return;
    }

    const { descripcion } = await datosAvance();
    
    await collection.updateOne(
        { _id: new ObjectId(proyectoSeleccionado._id) },
        {
            $push: {
                avances: {
                    fecha: new Date(),
                    descripcion: descripcion
                }
            }
        }
    );

    console.log(chalk.green("Avance registrado exitosamente✅"));

    await inquirer.prompt([{
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('\nPresiona Enter para continuar...'),
    }]);
  }
}
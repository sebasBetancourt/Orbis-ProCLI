import { Proyecto, proyectoModel } from "../models/Proyectos.js";
import chalk from "chalk";
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
}
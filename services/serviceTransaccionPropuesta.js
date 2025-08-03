import { connection } from '../config/db.js';
import { propuestaModel } from '../models/Propuestas.js'; 
import { ProyectoService } from './serviceProyectos.js';
import { seleccionarDocumentoPaginado } from '../utils/seleccionDocumento.js'; 
import chalk from 'chalk';
import inquirer from 'inquirer';
import { ObjectId } from 'mongodb';

export class TransaccionService {
    constructor() {
        this.proyectoService = new ProyectoService();
    }

    async aceptarPropuestaMenu() {
        const propuestaCollection = await propuestaModel();
        const propuestaSeleccionada = await seleccionarDocumentoPaginado(
            propuestaCollection,
            'Selecciona la propuesta que deseas aceptar:',
            'descripcion'
        );

        if (!propuestaSeleccionada) {
            return;
        }

        if (propuestaSeleccionada.estado !== 'Pendiente') {
            console.log(chalk.red.bold('\n❌ Esta propuesta ya ha sido procesada. No se puede aceptar de nuevo.'));
            return;
        }

        const { confirmacion } = await inquirer.prompt([{
            type: 'confirm',
            name: 'confirmacion',
            message: chalk.bgGreen.black(`¿Confirmas que deseas ACEPTAR la propuesta: "${propuestaSeleccionada.descripcion}"?`),
            default: false
        }]);

        if (!confirmacion) {
            console.log(chalk.yellow("\nOperación cancelada.❌"));
            return;
        }

        await this.ejecutarTransaccion(propuestaSeleccionada);
    }

    async ejecutarTransaccion(propuesta) {
        const client = await connection();
        const session = client.startSession();

        try {
            session.startTransaction();

            const propuestasCollection = await propuestaModel();
            await propuestasCollection.updateOne(
                { _id: new ObjectId(propuesta._id) },
                { $set: { estado: 'Aceptada', fechaAceptacion: new Date() } },
                { session }
            );

            const proyectoData = {
                clienteId: propuesta.clienteId,
                propuestaId: propuesta._id,
                descripcion: propuesta.descripcion,
                valor: propuesta.precio,
                fechaInicio: new Date(),
                estado: 'Pausado',
                avances: [],
                contratoId: null,
            };

            await this.proyectoService.createProyecto(proyectoData, session);

            await session.commitTransaction();
            console.log(chalk.green.bold(`\n🎉 ¡Transacción exitosa! La propuesta "${propuesta.descripcion}" ha sido aceptada y el proyecto ha sido creado. ✅`));
        } catch (error) {
            await session.abortTransaction();
            console.log(chalk.red.bold('\n❌ La transacción falló. Todos los cambios han sido deshechos.'));
            console.error(error);
        } finally {
            await session.endSession();
        }
    }
}
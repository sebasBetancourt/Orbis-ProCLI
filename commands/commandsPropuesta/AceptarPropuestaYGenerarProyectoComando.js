import { propuestaModel } from '../../models/Propuestas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class AceptarPropuestaYGenerarProyectoComando {
    async ejecutar() {
        try {
            const propuestas = await propuestaModel().find({ estado: 'Pendiente' });

            if (propuestas.length === 0) {
                console.log(chalk.yellow("No hay propuestas pendientes para aceptar."));
                return;
            }

            console.log(chalk.bold.blue("--- Propuestas Pendientes ---"));
            const opciones = propuestas.map(p => ({
                name: `ID: ${p._id} - Descripción: ${p.descripcion}`,
                value: p._id
            }));
            console.log(chalk.bold.blue("--------------------------"));

            const { idPropuesta } = await inquirer.prompt({
                type: 'list',
                name: 'idPropuesta',
                message: 'Selecciona la propuesta que deseas aceptar:',
                choices: opciones
            });

            // 1. Actualizar el estado de la propuesta
            await propuestaModel().updateOne(
                { _id: idPropuesta },
                { $set: { estado: 'Aceptada' } }
            );

            // 2. Crear el nuevo proyecto
            const propuestaAceptada = propuestas.find(p => p._id.toString() === idPropuesta);
            const nuevoProyecto = {
                descripcion: propuestaAceptada.descripcion,
                presupuesto: propuestaAceptada.presupuesto,
                fechaInicio: propuestaAceptada.fechaInicio,
                estado: 'Activo',
                avances: [] // Inicializa el array de avances
            };

            await proyectoModel().insertOne(nuevoProyecto);

            console.log(chalk.green("\n✅ Propuesta aceptada y proyecto generado exitosamente."));

        } catch (error) {
            console.error(chalk.red("Error al aceptar la propuesta y generar el proyecto:"), error);
            throw new Error("No se pudo generar el proyecto desde la propuesta.");
        }
    }
}
import { proyectoModel } from '../../models/Proyectos.js';
import chalk from 'chalk';

export class ListarProyectosComando {
    async ejecutar() {
        try {
            const proyectos = await proyectoModel().find({});
            
            if (proyectos.length === 0) {
                console.log(chalk.yellow("No hay proyectos registrados."));
                return;
            }

            console.log(chalk.bold.blue("--- Lista de Proyectos ---"));
            proyectos.forEach((proyecto, index) => {
                console.log(chalk.green(`\nProyecto #${index + 1}`));
                console.log(chalk.cyan(`ID de Proyecto: ${proyecto._id}`));
                console.log(`Descripción: ${proyecto.descripcion}`);
                console.log(`Presupuesto: ${proyecto.presupuesto}`);
                console.log(`Fecha de Inicio: ${proyecto.fechaInicio}`);
                console.log(`Estado: ${proyecto.estado}`);
            });
            console.log(chalk.bold.blue("\n--------------------------"));

        } catch (error) {
            console.error(chalk.red("Error al listar los proyectos:"), error);
            throw new Error("Error en el comando para listar proyectos.");
        }
    }
}
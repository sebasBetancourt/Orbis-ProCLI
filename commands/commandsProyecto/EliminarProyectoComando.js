import { proyectoModel } from '../../models/Proyectos.js';
import { Comando } from '../commandsPropuesta/Comando.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class EliminarProyectoComando extends Comando{
    async ejecutar() {
        try {
            const proyectos = await proyectoModel().find({});
            if (proyectos.length === 0) {
                console.log(chalk.yellow("No hay proyectos para eliminar."));
                return;
            }

            console.log(chalk.bold.blue("--- Proyectos Registrados ---"));
            proyectos.forEach((proyecto, index) => {
                console.log(chalk.green(`\n${index + 1}. ID: ${proyecto._id}`));
                console.log(`   Descripción: ${proyecto.descripcion}`);
            });
            console.log(chalk.bold.blue("\n--------------------------"));

            const { idProyecto } = await inquirer.prompt({
                type: 'input',
                name: 'idProyecto',
                message: 'Ingresa el ID del proyecto que deseas eliminar:',
                validate: (input) => input.trim() !== '' || 'El ID no puede estar vacío.'
            });

            const resultado = await proyectoModel().deleteOne({ _id: idProyecto });

            if (resultado.deletedCount === 1) {
                console.log(chalk.green("\n✅ Proyecto eliminado exitosamente."));
            } else {
                console.log(chalk.red("\n❌ No se encontró ningún proyecto con ese ID."));
            }

        } catch (error) {
            console.error(chalk.red("Error al eliminar el proyecto:"), error);
            throw new Error("Error en el comando para eliminar proyectos.");
        }
    }
}
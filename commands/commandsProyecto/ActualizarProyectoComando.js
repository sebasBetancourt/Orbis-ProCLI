import { proyectoModel } from '../../models/Proyectos.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class ActualizarProyectoComando {
    async ejecutar() {
        try {
            const proyectos = await proyectoModel().find({});
            if (proyectos.length === 0) {
                console.log(chalk.yellow("No hay proyectos para actualizar."));
                return;
            }

            console.log(chalk.bold.blue("--- Proyectos Registrados ---"));
            proyectos.forEach((proyecto, index) => {
                console.log(chalk.green(`\n${index + 1}. ID: ${proyecto._id}`));
                console.log(`   Descripción: ${proyecto.descripcion}`);
                console.log(`   Presupuesto: ${proyecto.presupuesto}`);
            });
            console.log(chalk.bold.blue("\n--------------------------"));

            const { idProyecto } = await inquirer.prompt({
                type: 'input',
                name: 'idProyecto',
                message: 'Ingresa el ID del proyecto que deseas actualizar:',
                validate: (input) => input.trim() !== '' || 'El ID no puede estar vacío.'
            });

            const proyectoAActualizar = await proyectoModel().findOne({ _id: idProyecto });
            if (!proyectoAActualizar) {
                console.log(chalk.red("\n❌ No se encontró ningún proyecto con ese ID."));
                return;
            }

            const datosNuevos = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'descripcion',
                    message: `Nueva descripción (actual: ${proyectoAActualizar.descripcion}):`,
                    default: proyectoAActualizar.descripcion,
                },
                {
                    type: 'input',
                    name: 'presupuesto',
                    message: `Nuevo presupuesto (actual: ${proyectoAActualizar.presupuesto}):`,
                    default: proyectoAActualizar.presupuesto,
                    validate: (input) => !isNaN(input) || 'El presupuesto debe ser un número.',
                },
            ]);

            await proyectoModel().updateOne(
                { _id: idProyecto },
                { $set: datosNuevos }
            );

            console.log(chalk.green("\n✅ Proyecto actualizado exitosamente."));

        } catch (error) {
            console.error(chalk.red("Error al actualizar el proyecto:"), error);
            throw new Error("Error en el comando para actualizar proyectos.");
        }
    }
}
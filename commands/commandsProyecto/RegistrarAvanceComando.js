import { proyectoModel } from '../../models/Proyectos.js';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class RegistrarAvanceComando {
    async ejecutar() {
        try {
            const proyectos = await proyectoModel().find({});
            if (proyectos.length === 0) {
                console.log(chalk.yellow("No hay proyectos para registrar avances."));
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
                message: 'Ingresa el ID del proyecto para registrar un avance:',
                validate: (input) => input.trim() !== '' || 'El ID no puede estar vacío.'
            });

            const proyectoAActualizar = await proyectoModel().findOne({ _id: idProyecto });
            if (!proyectoAActualizar) {
                console.log(chalk.red("\n❌ No se encontró ningún proyecto con ese ID."));
                return;
            }

            const avance = await inquirer.prompt([
                {
                    type: 'input',
                    name: 'descripcion',
                    message: 'Describe el avance registrado:',
                    validate: (input) => input.trim() !== '' || 'La descripción no puede estar vacía.',
                },
                {
                    type: 'input',
                    name: 'fecha',
                    message: 'Ingresa la fecha del avance (YYYY-MM-DD):',
                    validate: (input) => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato de fecha inválido. Usa YYYY-MM-DD.',
                },
            ]);

            const resultado = await proyectoModel().updateOne(
                { _id: idProyecto },
                { $push: { avances: avance } }
            );

            if (resultado.modifiedCount === 1) {
                console.log(chalk.green("\n✅ Avance registrado exitosamente."));
            } else {
                console.log(chalk.red("\n❌ No se pudo registrar el avance."));
            }

        } catch (error) {
            console.error(chalk.red("Error al registrar el avance:"), error);
            throw new Error("Error en el comando para registrar avance.");
        }
    }
}
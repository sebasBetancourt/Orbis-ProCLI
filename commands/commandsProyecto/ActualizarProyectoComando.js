import { Comando } from './Comando.js';
import { ProyectoFactory } from '../../models/ProyectoFactory.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { contratoModel } from '../../models/Contratos.js';
import { ObjectId } from 'mongodb';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ActualizarProyectoComando extends Comando {
  async ejecutar() {
    
    try {
      const proyectoCollection = await proyectoModel();
      const proyectos = await proyectoCollection.find().toArray();

      if (proyectos.length === 0) {
        console.log(chalk.red('No hay proyectos registrados. X'));
        return;
      }

      const opciones = proyectos.map((proyecto, index) => ({
        name: `${index + 1}. ${proyecto.nombre} (Estado: ${proyecto.estado})`,
        value: proyecto._id.toString(),
      }));

      const { proyectoId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'proyectoId',
          message: chalk.cyan('Selecciona el proyecto a actualizar:'),
          choices: opciones,
        },
      ]);

      const { estado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'estado',
          message: chalk.cyan('Selecciona el nuevo estado:'),
          choices: ['pausado', 'activo', 'finalizado', 'cancelado'],
        },
      ]);

      const session = (await proyectoModel()).client.startSession();
      try {
        await session.withTransaction(async () => {
          const proyectoCollection = await proyectoModel();
          const resultado = await proyectoCollection.updateOne(
            { _id: new ObjectId(proyectoId) },
            { $set: { estado } },
            { session }
          );

          if (resultado.matchedCount === 0) {
            throw new Error('Proyecto no encontrada');
          }

          if (estado === 'activo') {
            const proyecto = await proyectoCollection.findOne(
              { _id: new ObjectId(proyectoId) },
              { session }
            );
            const contrato = await ProyectoFactory.crearContratoDesdeProyecto(proyecto, contratoModel);
            // Contrato Embebido
            await proyectoCollection.updateOne(
              { _id: new ObjectId(proyectoId) },
              { $set: { contrato } },
              { session }
            );

          }
        });

        console.log(chalk.green('Proyecto actualizado exitosamente ✅'));
        console.log(chalk.green('Contrato generado Automaticamente.........✅'));
      } finally {
        await session.endSession();
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al actualizar el contrato: ${error.message}`));
    }
  }
}
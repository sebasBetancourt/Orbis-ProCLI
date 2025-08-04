import { Comando } from './Comando.js';
import {  propuestaModel } from '../../models/Propuestas.js';
import { PropuestaFactory } from '../../models/PropuestaFactory.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { ObjectId } from 'mongodb';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ActualizarPropuestaComando extends Comando {
  async ejecutar() {
    try {
      const propuestaCollection = await propuestaModel();
      const propuestas = await propuestaCollection.find().toArray();

      if (propuestas.length === 0) {
        console.log(chalk.yellow('No hay propuestas registradas.'));
        return;
      }

      const opciones = propuestas.map((propuesta, index) => ({
        name: `${index + 1}. ${propuesta.descripcion} (Estado: ${propuesta.estado})`,
        value: propuesta._id.toString(),
      }));

      const { propuestaId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'propuestaId',
          message: chalk.cyan('Selecciona la propuesta a actualizar:'),
          choices: opciones,
        },
      ]);

      const { estado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'estado',
          message: chalk.cyan('Selecciona el nuevo estado:'),
          choices: ['pendiente', 'aceptada', 'rechazada'],
        },
      ]);

      const session = (await propuestaModel()).client.startSession();
      try {
        await session.withTransaction(async () => {
          const propuestaCollection = await propuestaModel();
          const resultado = await propuestaCollection.updateOne(
            { _id: new ObjectId(propuestaId) },
            { $set: { estado } },
            { session }
          );

          if (resultado.matchedCount === 0) {
            throw new Error('Propuesta no encontrada');
          }

          if (estado === 'aceptada') {
            const propuesta = await propuestaCollection.findOne(
              { _id: new ObjectId(propuestaId) },
              { session }
            );
            await PropuestaFactory.crearProyectoDesdePropuesta(propuesta, proyectoModel);
          }
        });

        console.log(chalk.green('Propuesta actualizada exitosamente ✅'));
        console.log(chalk.green('Proyecto generado Automaticamente.........✅'));
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
      console.error(chalk.red(`Error al actualizar la propuesta: ${error.message}`));
    }
  }
}
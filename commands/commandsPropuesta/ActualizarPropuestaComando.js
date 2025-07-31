import { Comando } from './Comando.js';
import { Propuesta, PropuestaFactory, propuestaModel } from '../../models/Propuestas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { MongoClient, ObjectId } from 'mongodb';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ActualizarPropuestaComando extends Comando {
  async ejecutar() {
    const propuestaCollection = await propuestaModel();
    const propuestas = await propuestaCollection.find().toArray();
    if (propuestas.length === 0) {
      console.log(chalk.red('No hay propuestas registradas.'));
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

    const connection = await MongoClient.connect(process.env.MONGODB_URI || 'mongodb://localhost:27017');
    const session = connection.startSession();
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
          const propuesta = await propuestaCollection.findOne({ _id: new ObjectId(propuestaId) }, { session });
          await PropuestaFactory.crearProyectoDesdePropuesta(propuesta, proyectoModel);
        }
      });
      console.log(chalk.green('Propuesta actualizada exitosamente ✅'));
    } catch (error) {
      console.log(chalk.red(`Error: ${error.message}`));
    } finally {
      await session.endSession();
      await connection.close();
    }

    await inquirer.prompt([
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright('Presiona Enter para continuar...'),
      },
    ]);
  }
}
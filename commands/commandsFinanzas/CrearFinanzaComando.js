import { Comando } from '../commandsClient/Comando.js';
import { Finanza, finanzaModel } from '../../models/Finanzas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { pedirDatosFinanza } from '../../utils/pedirDatosFinanza.js';
import { ObjectId } from 'mongodb';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class CrearFinanzaComando extends Comando {
  async ejecutar() {
    try {
      const finanzaCollection = await finanzaModel();
      const proyectoCollection = await proyectoModel();
      const datos = await pedirDatosFinanza();

      const finanza = new Finanza({
        proyectoId: datos.proyectoId,
        tipo: datos.tipo,
        concepto: datos.concepto,
        monto: datos.monto,
        fecha: datos.fecha
      });

      const session = (await finanzaModel()).client.startSession();
      try {
        await session.withTransaction(async () => {
          // Insertar el registro financiero
          await finanzaCollection.insertOne(finanza, { session });

          // Actualizar el balance del proyecto
          const updateField = finanza.tipo === 'ingreso' ? { $inc: { 'balance': finanza.monto } } : { $inc: { 'balance': -finanza.monto } };
          const result = await proyectoCollection.updateOne(
            { _id: new ObjectId(finanza.proyectoId) },
            updateField,
            { session }
          );

          if (result.matchedCount === 0) {
            throw new Error('Proyecto no encontrado');
          }
        });

        console.log(chalk.green('Registro financiero creado exitosamente ✅'));
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
      console.error(chalk.red(`Error al crear registro financiero: ${error.message}`));
    }
  }
}
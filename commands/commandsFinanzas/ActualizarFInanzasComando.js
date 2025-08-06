import { Comando } from '../commandsClient/Comando.js';
import { finanzaModel } from '../../models/Finanzas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { pedirDatosFinanza } from '../../utils/pedirDatosFinanza.js';
import { ObjectId } from 'mongodb';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class ActualizarFinanzaComando extends Comando {
  async ejecutar() {
    try {
      const finanzaCollection = await finanzaModel();
      const finanzas = await finanzaCollection.find().toArray();

      if (finanzas.length === 0) {
        console.log(chalk.yellow('No hay registros financieros para actualizar.'));
        return;
      }

      const opciones = finanzas.map((finanza, index) => ({
        name: `${index + 1}. ${finanza.concepto} ($${finanza.monto}, ${finanza.tipo})`,
        value: finanza._id.toString(),
      }));

      const { finanzaId } = await inquirer.prompt([
        {
          type: 'list',
          name: 'finanzaId',
          message: chalk.cyan('Selecciona el registro financiero a actualizar:'),
          choices: opciones,
        },
      ]);

      const nuevosDatos = await pedirDatosFinanza();
      const finanzaOriginal = await finanzaCollection.findOne({ _id: new ObjectId(finanzaId) });

      const session = (await finanzaModel()).client.startSession();
      try {
        await session.withTransaction(async () => {
          // Revertir el balance anterior
          const revertUpdate = finanzaOriginal.tipo === 'ingreso'
            ? { $inc: { 'balance': -finanzaOriginal.monto } }
            : { $inc: { 'balance': finanzaOriginal.monto } };
          await (await proyectoModel()).updateOne(
            { _id: finanzaOriginal.proyectoId },
            revertUpdate,
            { session }
          );

          // Actualizar el registro financiero
          await finanzaCollection.updateOne(
            { _id: new ObjectId(finanzaId) },
            { $set: {
                proyectoId: new ObjectId(nuevosDatos.proyectoId),
                tipo: nuevosDatos.tipo,
                concepto: nuevosDatos.concepto,
                monto: nuevosDatos.monto,
                fecha: nuevosDatos.fecha,
              }
            },
            { session }
          );

          // Actualizar el balance con los nuevos datos
          const updateField = nuevosDatos.tipo === 'ingreso'
            ? { $inc: { 'balance': nuevosDatos.monto } }
            : { $inc: { 'balance': -nuevosDatos.monto } };
          await (await proyectoModel()).updateOne(
            { _id: nuevosDatos.proyectoId },
            updateField,
            { session }
          );
        });

        console.log(chalk.green('Registro financiero actualizado exitosamente ✅'));
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
      console.error(chalk.red(`Error al actualizar registro financiero: ${error.message}`));
    }
  }
}
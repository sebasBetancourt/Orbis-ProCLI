import { Comando } from '../commandsClient/Comando.js';
import { finanzaModel } from '../../models/Finanzas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { ObjectId } from 'mongodb';
import inquirer from 'inquirer';
import chalk from 'chalk';

export class EliminarFinanzaComando extends Comando {
  async ejecutar() {
    try {
      const finanzaCollection = await finanzaModel();
      const finanzas = await finanzaCollection.find().toArray();

      if (finanzas.length === 0) {
        console.log(chalk.yellow('No hay registros financieros para eliminar.'));
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
          message: chalk.cyan('Selecciona el registro financiero a eliminar:'),
          choices: opciones,
        },
      ]);

      const finanza = await finanzaCollection.findOne({ _id: new ObjectId(finanzaId) });

      const session = (await finanzaModel()).client.startSession();
      try {
        await session.withTransaction(async () => {
          // Revertir el balance del proyecto
          const updateField = finanza.tipo === 'ingreso'
            ? { $inc: { 'balance': -finanza.monto } }
            : { $inc: { 'balance': finanza.monto } };
          await (await proyectoModel()).updateOne(
            { _id: finanza.proyectoId },
            updateField,
            { session }
          );

          const { confirmDelete } = await inquirer.prompt([
          {
              type: 'confirm',
              name: 'confirmDelete',
              message: chalk.bgRed('¿Estás seguro de que deseas eliminar esta finanza? ⚠️'),
            },
          ]);
        
          if (confirmDelete) {
            await finanzaCollection.deleteOne({ _id: new ObjectId(finanzaId) }, { session });
            console.log(chalk.green('Registro financiero eliminado exitosamente ✅'));
          } else {
            console.log(chalk.yellow("\nOperación cancelada por el usuario.❌\n"));
          }

        });

        
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
      console.error(chalk.red(`Error al eliminar registro financiero: ${error.message}`));
    }
  }
}
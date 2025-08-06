import { Comando } from './Comando.js';
import { ProyectoFactory } from '../../models/ProyectoFactory.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { contratoModel } from '../../models/Contratos.js';
import { finanzaModel } from '../../models/Finanzas.js';
import { ObjectId } from 'mongodb';
import chalk from 'chalk';
import inquirer from 'inquirer';

export class ActualizarProyectoComando extends Comando {
  async ejecutar() {
    try {
      const proyectoCollection = await proyectoModel();
      const contratoCollection = await contratoModel();
      const finanzaCollection = await finanzaModel();

      const proyectos = await proyectoCollection.find().toArray();

      if (proyectos.length === 0) {
        console.log(chalk.red('No hay proyectos registrados. ❌'));
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

      const session = proyectoCollection.client.startSession();
      try {
        await session.withTransaction(async () => {
          // Actualizar estado del proyecto
          const proyecto = await proyectoCollection.findOne({ _id: new ObjectId(proyectoId) }, { session });
          if (!proyecto) {
            throw new Error('Proyecto no encontrado');
          }

          await proyectoCollection.updateOne(
            { _id: new ObjectId(proyectoId) },
            { $set: { estado } },
            { session }
          );

          // Manejar casos de "finalizado" o "cancelado"
          if (estado === 'finalizado' || estado === 'cancelado') {
            // Actualizar entregables (marcar como finalizados si estado es "finalizado")
            if (estado === 'finalizado') {
              await proyectoCollection.updateOne(
                { _id: new ObjectId(proyectoId) },
                { $set: { 'entregables.$[].estado': 'finalizado' } },
                { session }
              );
            }

            // Registrar movimiento financiero final
            const movimientoFinanciero = {
              proyectoId: new ObjectId(proyectoId),
              tipo: estado === 'finalizado' ? 'ingreso' : 'egreso',
              concepto: estado === 'finalizado' ? 'Pago final por proyecto completado' : 'Costo por cancelación de proyecto',
              monto: estado === 'finalizado' ? 1000000 : 500000, // Montos ficticios, ajustar según lógica
              fecha: new Date(),
            };

            await finanzaCollection.insertOne(movimientoFinanciero, { session });

            // Actualizar balance del proyecto
            const updateField = estado === 'finalizado' ? { $inc: { balance: movimientoFinanciero.monto } } : { $inc: { balance: -movimientoFinanciero.monto } };
            await proyectoCollection.updateOne(
              { _id: new ObjectId(proyectoId) },
              updateField,
              { session }
            );

            // Actualizar estado del contrato
            await contratoCollection.updateOne(
              { proyectoId: new ObjectId(proyectoId) },
              { $set: { estado: estado } },
              { session }
            );
          } else if (estado === 'activo') {
            // Generar contrato si el estado es "activo" (mantengo lógica original)
            const contrato = await ProyectoFactory.crearContratoDesdeProyecto(proyecto, contratoModel);
            await proyectoCollection.updateOne(
              { _id: new ObjectId(proyectoId) },
              { $set: { contrato } },
              { session }
            );
          }
        });

        console.log(chalk.green(`Proyecto actualizado a estado "${estado}" exitosamente ✅`));
        if (estado === 'finalizado' || estado === 'cancelado') {
          console.log(chalk.green('Entregables, contrato y movimiento financiero actualizados ✅'));
        } else if (estado === 'activo') {
          console.log(chalk.green('Contrato generado automáticamente ✅'));
        }
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
      console.error(chalk.red(`Error al actualizar el proyecto: ${error.message}`));
    }
  }
}
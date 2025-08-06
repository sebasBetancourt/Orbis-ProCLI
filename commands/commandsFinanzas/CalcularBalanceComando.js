import { Comando } from '../commandsClient/Comando.js';
import { finanzaModel } from '../../models/Finanzas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { clienteModel } from '../../models/Cliente.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';

export class CalcularBalanceComando extends Comando {
  async ejecutar() {
    try {
      const { tipoFiltro } = await inquirer.prompt([
        {
          type: 'list',
          name: 'tipoFiltro',
          message: chalk.cyan('Selecciona el tipo de balance:'),
          choices: [
            { name: 'Por cliente', value: 'cliente' },
            { name: 'Por fecha', value: 'fecha' },
          ],
        },
      ]);

      const finanzaCollection = await finanzaModel();
      let balance;

      if (tipoFiltro === 'cliente') {
        const clienteCollection = await clienteModel();
        const clientes = await clienteCollection.find().toArray();
        const opciones = clientes.map((cliente) => ({
          name: `${cliente.nombre}`,
          value: cliente._id.toString(),
        }));

        const { clienteId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'clienteId',
            message: chalk.cyan('Selecciona el cliente:'),
            choices: opciones,
          },
        ]);

        const proyectos = await (await proyectoModel()).find({ clienteId: new ObjectId(clienteId) }).toArray();
        const proyectoIds = proyectos.map((p) => p._id);

        const pipeline = [
          { $match: { proyectoId: { $in: proyectoIds } } },
          {
            $group: {
              _id: null,
              totalIngresos: { $sum: { $cond: [{ $eq: ['$tipo', 'ingreso'] }, '$monto', 0] } },
              totalEgresos: { $sum: { $cond: [{ $eq: ['$tipo', 'egreso'] }, '$monto', 0] } },
            },
          },
        ];

        const [result] = await finanzaCollection.aggregate(pipeline).toArray();
        balance = (result?.totalIngresos || 0) - (result?.totalEgresos || 0);

        console.log(chalk.green.bold(`Balance para el cliente: $${balance}`));
      } else {
        const { fechaInicio, fechaFin } = await inquirer.prompt([
          {
            type: 'input',
            name: 'fechaInicio',
            message: chalk.cyan('Ingresa la fecha de inicio (YYYY-MM-DD):'),
            validate: (input) => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato inválido',
          },
          {
            type: 'input',
            name: 'fechaFin',
            message: chalk.cyan('Ingresa la fecha de fin (YYYY-MM-DD):'),
            validate: (input) => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato inválido',
          },
        ]);

        const pipeline = [
          {
            $match: {
              fecha: {
                $gte: new Date(fechaInicio),
                $lte: new Date(fechaFin),
              },
            },
          },
          {
            $group: {
              _id: null,
              totalIngresos: { $sum: { $cond: [{ $eq: ['$tipo', 'ingreso'] }, '$monto', 0] } },
              totalEgresos: { $sum: { $cond: [{ $eq: ['$tipo', 'egreso'] }, '$monto', 0] } },
            },
          },
        ];

        const [result] = await finanzaCollection.aggregate(pipeline).toArray();
        balance = (result?.totalIngresos || 0) - (result?.totalEgresos || 0);

        console.log(chalk.green.bold(`Balance para el período: $${balance}`));
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al calcular balance: ${error.message}`));
    }
  }
}
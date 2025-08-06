import { finanzaModel } from '../../models/Finanzas.js';
import { proyectoModel } from '../../models/Proyectos.js';
import { clienteModel } from '../../models/Cliente.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { ObjectId } from 'mongodb';
import { Comando } from './Comando.js'

export class ListarFinanzasComando extends Comando {
  async ejecutar() {
    try {
      const finanzaCollection = await finanzaModel();
      const proyectoCollection = await proyectoModel();
      const clienteCollection = await clienteModel();

      const { tipoFiltro } = await inquirer.prompt([
        {
          type: 'list',
          name: 'tipoFiltro',
          message: chalk.cyan('Selecciona el tipo de filtro para listar finanzas:'),
          choices: [
            { name: 'Búsqueda inteligente (concepto o monto)', value: 'busqueda' },
            { name: 'Por proyecto', value: 'proyecto' },
            { name: 'Por cliente', value: 'cliente' },
            { name: 'Por fecha', value: 'fecha' },
            { name: 'Todos', value: 'todos' },
          ],
        },
      ]);

      let finanzas = [];
      const pageSize = 5; // Mostrar 5 registros por página
      let page = 1;
      let continuar = true;

      while (continuar) {
        console.clear();
        let query = {};

        if (tipoFiltro === 'busqueda') {
          const { termino } = await inquirer.prompt([
            {
              type: 'input',
              name: 'termino',
              message: chalk.cyan('Ingresa el término de búsqueda (concepto o monto):'),
              validate: (input) => input.trim() !== '' || 'El término no puede estar vacío',
            },
          ]);

          // Búsqueda por concepto (insensible a mayúsculas) o monto
          query = {
            $or: [
              { concepto: { $regex: termino, $options: 'i' } },
              { monto: !isNaN(termino) ? Number(termino) : -1 },
            ],
          };
        } else if (tipoFiltro === 'proyecto') {
          const proyectos = await proyectoCollection.find().toArray();
          const opciones = proyectos.map((proyecto) => ({
            name: `${proyecto.nombre}`,
            value: proyecto._id.toString(),
          }));

          const { proyectoId } = await inquirer.prompt([
            {
              type: 'list',
              name: 'proyectoId',
              message: chalk.cyan('Selecciona el proyecto:'),
              choices: opciones,
            },
          ]);
          query = { proyectoId: new ObjectId(proyectoId) };
        } else if (tipoFiltro === 'cliente') {
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

          const proyectos = await proyectoCollection.find({ clienteId: new ObjectId(clienteId) }).toArray();
          query = { proyectoId: { $in: proyectos.map((p) => p._id) } };
        } else if (tipoFiltro === 'fecha') {
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
          query = {
            fecha: {
              $gte: new Date(fechaInicio),
              $lte: new Date(fechaFin),
            },
          };
        }

        finanzas = await finanzaCollection
          .find(query)
          .skip((page - 1) * pageSize)
          .limit(pageSize)
          .toArray();

        if (finanzas.length === 0) {
          console.log(chalk.yellow('No se encontraron registros financieros.'));
          break;
        }

        console.log(chalk.green.bold('\nRegistros Financieros (Resumen):'));
        const opcionesFinanzas = finanzas.map((finanza, index) => ({
          name: chalk.cyan(`${index + 1}. ${finanza.concepto} (${finanza.tipo}, $${finanza.monto})`),
          value: finanza._id.toString(),
        }));

        const { accion, finanzaId } = await inquirer.prompt([
          {
            type: 'list',
            name: 'accion',
            message: chalk.cyan('Selecciona una transacción para ver detalles o navega:'),
            choices: [
              ...opcionesFinanzas,
              new inquirer.Separator(),
              { name: 'Siguiente página', value: 'siguiente' },
              { name: 'Página anterior', value: 'anterior' },
              { name: 'Salir', value: 'salir' },
            ],
          },
        ]);

        if (accion === 'siguiente' && finanzas.length === pageSize) {
          page++;
        } else if (accion === 'anterior' && page > 1) {
          page--;
        } else if (accion === 'salir') {
          continuar = false;
        } else {
          // Mostrar detalles de la transacción seleccionada
          const finanza = finanzas.find((f) => f._id.toString() === accion);
          if (finanza) {
            console.clear();
            const proyecto = await proyectoCollection.findOne({ _id: finanza.proyectoId });
            const cliente = proyecto ? await clienteCollection.findOne({ _id: proyecto.clienteId }) : null;

            console.log(chalk.green.bold('\nDetalles de la Transacción:'));
            console.log(chalk.cyan(`ID: ${finanza._id}`));
            console.log(`Proyecto: ${proyecto?.nombre || 'No encontrado'}`);
            console.log(`Cliente: ${cliente?.nombre || 'No encontrado'}`);
            console.log(`Tipo: ${finanza.tipo}`);
            console.log(`Concepto: ${finanza.concepto}`);
            console.log(`Monto: $${finanza.monto}`);
            console.log(`Fecha: ${new Date(finanza.fecha).toLocaleDateString()}`);

            await inquirer.prompt([
              {
                type: 'input',
                name: 'continuar',
                message: chalk.blueBright('Presiona Enter para volver a la lista...'),
              },
            ]);
          }
        }
      }

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ]);
    } catch (error) {
      console.error(chalk.red(`Error al listar finanzas: ${error.message}`));
    }
  }
}
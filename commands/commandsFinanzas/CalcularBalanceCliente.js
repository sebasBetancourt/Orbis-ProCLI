import { Comando } from './Comando.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { finanzaModel } from '../../models/Finanzas.js';
import { clienteModel } from '../../models/Cliente.js';

export class CalcularBalanceCliente extends Comando {
  async pausePrompt(message = 'Presiona Enter para continuar...') {
    const pauseQuestions = [
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright(message),
      },
    ];
    await inquirer.prompt(pauseQuestions);
  }

  async seleccionarCliente(clienteCollection, mensaje = 'Selecciona un cliente para calcular el balance:') {
    const pageSize = 3;
    let page = 0;

    while (true) {
      console.clear();
      const clientes = await clienteCollection.find({})
        .skip(page * pageSize)
        .limit(pageSize)
        .toArray();

      const totalClientes = await clienteCollection.countDocuments({});

      if (clientes.length === 0 && page === 0) {
        console.clear();
        console.log(chalk.red.bold('\nNo hay clientes disponibles. ❌\n'));
        await this.pausePrompt();
        return null;
      }

      const opciones = clientes.map((cliente, index) => ({
        name: `${(page * pageSize) + index + 1}. ${cliente.nombre} (Email: ${cliente.email})`,
        value: cliente,
      }));

      if (page > 0) {
        opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
      }
      if ((page + 1) * pageSize < totalClientes) {
        opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
      }

      opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente 🔍'), value: 'busqueda' });
      opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

      const questions = [
        {
          type: 'list',
          name: 'clienteSeleccionado',
          message: chalk.yellow(`\n${mensaje}\n`),
          choices: opciones,
        },
      ];

      const { clienteSeleccionado } = await inquirer.prompt(questions);

      if (clienteSeleccionado === 'anterior') {
        if (page > 0) page--;
        continue;
      }
      if (clienteSeleccionado === 'siguiente') {
        page++;
        continue;
      }

      if (clienteSeleccionado === 'busqueda') {
        console.clear();
        const searchQuestions = [
          {
            type: 'input',
            name: 'textoBusqueda',
            message: chalk.cyan('🔍 Ingresa el nombre o parte del cliente a buscar:'),
          },
        ];
        const { textoBusqueda } = await inquirer.prompt(searchQuestions);

        let searchPage = 0;
        const searchFiltro = { nombre: { $regex: textoBusqueda, $options: 'i' } };

        while (true) {
          console.clear();
          const resultados = await clienteCollection.find(searchFiltro)
            .skip(searchPage * pageSize)
            .limit(pageSize)
            .toArray();

          const totalResultados = await clienteCollection.countDocuments(searchFiltro);

          if (resultados.length === 0) {
            console.log(chalk.red('\n❌ No se encontraron clientes coincidentes.\n'));
            await this.pausePrompt('Presiona Enter para volver...');
            break;
          }

          const opcionesBusqueda = resultados.map((cliente, index) => ({
            name: `${(searchPage * pageSize) + index + 1}. ${cliente.nombre} (Email: ${cliente.email})`,
            value: cliente,
          }));

          if (searchPage > 0) {
            opcionesBusqueda.push({
              name: chalk.italic.bgCyan.black('<== Página anterior'),
              value: 'anteriorBusqueda',
            });
          }
          if ((searchPage + 1) * pageSize < totalResultados) {
            opcionesBusqueda.push({
              name: chalk.italic.bgCyan.black('==> Siguiente página'),
              value: 'siguienteBusqueda',
            });
          }

          opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Volver'), value: null });

          const questionsBusqueda = [
            {
              type: 'list',
              name: 'clienteEncontrado',
              message: chalk.yellow('\nResultados encontrados:'),
              choices: opcionesBusqueda,
            },
          ];

          const { clienteEncontrado } = await inquirer.prompt(questionsBusqueda);

          if (clienteEncontrado === 'anteriorBusqueda') {
            if (searchPage > 0) searchPage--;
            continue;
          }
          if (clienteEncontrado === 'siguienteBusqueda') {
            searchPage++;
            continue;
          }
          if (!clienteEncontrado) {
            break;
          }

          return clienteEncontrado;
        }
        continue;
      }

      if (clienteSeleccionado === 'salir') {
        return null;
      }

      return clienteSeleccionado;
    }
  }

  async ejecutar() {
    try {
      const clienteCollection = await clienteModel();
      const finanzaCollection = await finanzaModel();

      console.clear();
      const cliente = await this.seleccionarCliente(clienteCollection);
      if (!cliente) {
        console.clear();
        console.log(chalk.red('No se seleccionó ningún cliente. Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      console.clear();
      const finanzas = await finanzaCollection.find({ clienteId: cliente._id }).toArray();
      const ingresos = finanzas
        .filter(f => f.tipo === 'ingreso')
        .reduce((sum, f) => sum + f.monto, 0);
      const egresos = finanzas
        .filter(f => f.tipo === 'egreso')
        .reduce((sum, f) => sum + f.monto, 0);
      const balance = ingresos - egresos;

      console.clear();
      console.log(chalk.yellow(`Balance financiero para el cliente "${cliente.nombre}":`));
      console.log(chalk.cyan(`Ingresos totales: ${ingresos.toFixed(2)}`));
      console.log(chalk.red(`Egresos totales: ${egresos.toFixed(2)}`));
      console.log(chalk.green(`Balance: ${balance.toFixed(2)}`));
      if (finanzas.length > 0) {
        console.log(chalk.yellow('\nTransacciones:'));
        finanzas.forEach(f => {
          console.log(
            `${f.tipo === 'ingreso' ? chalk.cyan('+') : chalk.red('-')} ${f.monto.toFixed(2)} - ${f.descripcion} (${dayjs(f.fecha).format('YYYY-MM-DD')})`
          );
        });
      } else {
        console.log(chalk.red('No hay transacciones registradas para este cliente.'));
      }
      await this.pausePrompt();
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error al calcular balance: ${error.message}`));
      await this.pausePrompt();
    }
  }
}
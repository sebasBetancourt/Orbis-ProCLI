import { Comando } from './Comando.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { proyectoModel } from '../../models/Proyectos.js';
import { finanzaModel, Finanza } from '../../models/Finanzas.js';

export class RegistrarIngreso extends Comando {
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

  async seleccionarProyecto(proyectoCollection, mensaje = 'Selecciona un proyecto para el ingreso:') {
    const pageSize = 3;
    let page = 0;
    let filtro = { estado: 'activo' };

    while (true) {
      console.clear();
      const proyectos = await proyectoCollection.find(filtro)
        .skip(page * pageSize)
        .limit(pageSize)
        .toArray();

      const totalProyectos = await proyectoCollection.countDocuments(filtro);

      if (proyectos.length === 0 && page === 0) {
        console.clear();
        console.log(chalk.red.bold('\nNo hay proyectos activos disponibles. ❌\n'));
        await this.pausePrompt();
        return null;
      }

      const opciones = proyectos.map((proyecto, index) => ({
        name: `${(page * pageSize) + index + 1}. ${proyecto.nombre} (Estado: ${proyecto.estado})`,
        value: proyecto,
      }));

      if (page > 0) {
        opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
      }
      if ((page + 1) * pageSize < totalProyectos) {
        opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
      }

      opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente 🔍'), value: 'busqueda' });
      opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

      const questions = [
        {
          type: 'list',
          name: 'proyectoSeleccionado',
          message: chalk.yellow(`\n${mensaje}\n`),
          choices: opciones,
        },
      ];

      const { proyectoSeleccionado } = await inquirer.prompt(questions);

      if (proyectoSeleccionado === 'anterior') {
        if (page > 0) page--;
        continue;
      }
      if (proyectoSeleccionado === 'siguiente') {
        page++;
        continue;
      }

      if (proyectoSeleccionado === 'busqueda') {
        console.clear();
        const searchQuestions = [
          {
            type: 'input',
            name: 'textoBusqueda',
            message: chalk.cyan('🔍 Ingresa el nombre o parte del proyecto a buscar:'),
          },
        ];
        const { textoBusqueda } = await inquirer.prompt(searchQuestions);

        let searchPage = 0;
        const searchFiltro = { ...filtro, nombre: { $regex: textoBusqueda, $options: 'i' } };

        while (true) {
          console.clear();
          const resultados = await proyectoCollection.find(searchFiltro)
            .skip(searchPage * pageSize)
            .limit(pageSize)
            .toArray();

          const totalResultados = await proyectoCollection.countDocuments(searchFiltro);

          if (resultados.length === 0) {
            console.log(chalk.red('\n❌ No se encontraron proyectos activos coincidentes.\n'));
            await this.pausePrompt('Presiona Enter para volver...');
            break;
          }

          const opcionesBusqueda = resultados.map((proyecto, index) => ({
            name: `${(searchPage * pageSize) + index + 1}. ${proyecto.nombre} (Estado: ${proyecto.estado})`,
            value: proyecto,
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
              name: 'proyectoEncontrado',
              message: chalk.yellow('\nResultados encontrados (proyectos activos):'),
              choices: opcionesBusqueda,
            },
          ];

          const { proyectoEncontrado } = await inquirer.prompt(questionsBusqueda);

          if (proyectoEncontrado === 'anteriorBusqueda') {
            if (searchPage > 0) searchPage--;
            continue;
          }
          if (proyectoEncontrado === 'siguienteBusqueda') {
            searchPage++;
            continue;
          }
          if (!proyectoEncontrado) {
            break;
          }

          return proyectoEncontrado;
        }
        continue;
      }

      if (proyectoSeleccionado === 'salir') {
        return null;
      }

      return proyectoSeleccionado;
    }
  }

  async ejecutar() {
    try {
      const proyectoCollection = await proyectoModel();
      const finanzaCollection = await finanzaModel();

      console.clear();
      const proyecto = await this.seleccionarProyecto(proyectoCollection);
      if (!proyecto) {
        console.clear();
        console.log(chalk.red('No se seleccionó ningún proyecto. Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      console.clear();
      const questions = [
        {
          type: 'input',
          name: 'monto',
          message: chalk.yellow('Ingresa el monto del ingreso:'),
          validate: (input) => {
            const monto = parseFloat(input);
            return !isNaN(monto) && monto > 0 ? true : 'El monto debe ser un número positivo';
          },
        },
        {
          type: 'input',
          name: 'fecha',
          message: chalk.yellow('Ingresa la fecha del ingreso (YYYY-MM-DD, vacío para hoy):'),
          default: dayjs().format('YYYY-MM-DD'),
          validate: (input) => {
            const fecha = dayjs(input, 'YYYY-MM-DD', true);
            return fecha.isValid() ? true : 'La fecha debe ser válida en formato YYYY-MM-DD';
          },
        },
        {
          type: 'input',
          name: 'descripcion',
          message: chalk.yellow('Ingresa una descripción del ingreso:'),
          validate: (input) => input.trim() ? true : 'La descripción no puede estar vacía',
        },
      ];

      const { monto, fecha, descripcion } = await inquirer.prompt(questions);

      const finanza = new Finanza({
        tipo: 'ingreso',
        monto: parseFloat(monto),
        fecha,
        descripcion,
        proyectoId: proyecto._id,
        clienteId: proyecto.clienteId,
      });

      const session = proyectoCollection.client.startSession();
      try {
        await session.withTransaction(async () => {
          const result = await finanzaCollection.insertOne(finanza, { session });
          if (!result.insertedId) {
            throw new Error('No se pudo registrar el ingreso');
          }
        });

        console.clear();
        console.log(chalk.green(`Ingreso de ${monto} registrado exitosamente para el proyecto "${proyecto.nombre}"!`));
        await this.pausePrompt();
      } finally {
        await session.endSession();
      }
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error al registrar ingreso: ${error.message}`));
      await this.pausePrompt();
    }
  }
}
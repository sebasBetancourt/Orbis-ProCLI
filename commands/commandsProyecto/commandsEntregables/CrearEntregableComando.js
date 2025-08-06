import { Comando } from "../Comando.js";
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { proyectoModel } from '../../../models/Proyectos.js';
import { Entregable, entregableModel } from '../../../models/Entregables.js';
import { ObjectId } from 'mongodb';

export class CrearEntregable extends Comando {
  // Función auxiliar para manejar pausas
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

  async ejecutar() {
    try {
      const proyectoCollection = await proyectoModel();
      const entregableCollection = await entregableModel();

      // Función de selección de proyecto embebida, solo proyectos activos
      const seleccionarProyecto = async (mensaje = 'Selecciona un proyecto para añadir un entregable:') => {
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
            console.log(chalk.red.bold('\nNo hay proyectos activos disponibles para mostrar. ❌\n'));
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
      };

      // Seleccionar el proyecto
      console.clear();
      const proyecto = await seleccionarProyecto();
      if (!proyecto) {
        console.clear();
        console.log(chalk.red('No se seleccionó ningún proyecto. Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      // Verificar el límite de entregables
      const entregables = Array.isArray(proyecto.entregables) ? proyecto.entregables : [];
      const numEntregables = entregables.length;
      const tieneRechazado = entregables.some(e => e.estado === 'rechazado');

      if (!Array.isArray(proyecto.entregables)) {
        console.log(chalk.yellow('Advertencia: El proyecto no tiene un arreglo de entregables definido. Se inicializará como vacío.'));
      }

      if (numEntregables >= 4 && !tieneRechazado) {
        console.clear();
        console.log(chalk.red('El proyecto ya tiene 4 entregables y ninguno está rechazado. No se puede añadir más.'));
        await this.pausePrompt();
        return;
      }

      // Solicitar datos del entregable
      console.clear();
      const hoy = dayjs('2025-08-05');
      const questionsEntregable = [
        {
          type: 'input',
          name: 'titulo',
          message: 'Ingresa el título del entregable:',
          validate: (input) => {
            const trimmed = input.trim();
            return trimmed ? true : 'El título no puede estar vacío';
          },
        },
        {
          type: 'input',
          name: 'fechaLimite',
          message: 'Ingresa la fecha límite (formato YYYY-MM-DD, a partir de 2025-08-05):',
          validate: (input) => {
            const fecha = dayjs(input.trim(), 'YYYY-MM-DD', true);
            if (!fecha.isValid()) {
              return 'Debes ingresar una fecha válida en formato YYYY-MM-DD';
            }
            const year = fecha.year();
            const month = fecha.month() + 1;
            const day = fecha.date();
            if (year < 2025 || fecha.isBefore(hoy, 'day')) {
              return 'La fecha límite debe ser el 5 de agosto de 2025 o posterior';
            }
            if (month < 1 || month > 12) {
              return 'El mes debe estar entre 01 y 12';
            }
            if (day < 1 || day > fecha.daysInMonth()) {
              return `El día debe estar entre 01 y ${fecha.daysInMonth()} para el mes ${month}`;
            }
            if (proyecto.contrato && proyecto.contrato.fechaInicio && proyecto.contrato.fechaFin) {
              const fechaInicioContrato = dayjs(proyecto.contrato.fechaInicio);
              const fechaFinContrato = dayjs(proyecto.contrato.fechaFin);
              if (fecha.isBefore(fechaInicioContrato, 'day')) {
                return `La fecha límite debe ser igual o posterior a la fecha de inicio del contrato (${fechaInicioContrato.format('YYYY-MM-DD')})`;
              }
              if (fecha.isAfter(fechaFinContrato, 'day')) {
                return `La fecha límite debe ser igual o anterior a la fecha de fin del contrato (${fechaFinContrato.format('YYYY-MM-DD')})`;
              }
            } else if (proyecto.contrato && proyecto.contrato.fechaFin) {
              const fechaFinContrato = dayjs(proyecto.contrato.fechaFin);
              if (fecha.isAfter(fechaFinContrato, 'day')) {
                return `La fecha límite debe ser igual o anterior a la fecha de fin del contrato (${fechaFinContrato.format('YYYY-MM-DD')})`;
              }
            }
            return true;
          },
        },
      ];

      const { titulo, fechaLimite } = await inquirer.prompt(questionsEntregable);

      // Crear y validar el entregable
      const entregableData = {
        _id: new ObjectId(),
        titulo,
        fechaLimite: new Date(fechaLimite),
        estado: 'pendiente',
        proyectoId: proyecto._id,
      };

      const entregable = new Entregable(entregableData);

      // Iniciar transacción para actualizar el proyecto e insertar en entregables
      const session = proyectoCollection.client.startSession();
      try {
        await session.withTransaction(async () => {
          // Si entregables no es un arreglo, inicializarlo primero
          if (!Array.isArray(proyecto.entregables)) {
            await proyectoCollection.updateOne(
              { _id: proyecto._id },
              { $set: { entregables: [] } },
              { session }
            );
          }

          // Añadir el entregable al proyecto
          const resultProyecto = await proyectoCollection.updateOne(
            { _id: proyecto._id },
            {
              $push: {
                entregables: {
                  _id: entregable._id,
                  titulo: entregable.titulo,
                  fechaLimite: entregable.fechaLimite,
                  estado: entregable.estado,
                },
              }
            },
            { session }
          );

          if (resultProyecto.modifiedCount === 0) {
            throw new Error('No se pudo añadir el entregable al proyecto');
          }

          // Insertar el entregable en la colección entregables
          const resultEntregable = await entregableCollection.insertOne(
            {
              _id: entregable._id,
              titulo: entregable.titulo,
              fechaLimite: entregable.fechaLimite,
              estado: entregable.estado
            },
            { session }
          );

          if (!resultEntregable.insertedId) {
            throw new Error('No se pudo insertar el entregable en la colección entregables');
          }
        });

        console.clear();
        console.log(chalk.green(`Entregable "${entregable.titulo}" creado exitosamente para el proyecto "${proyecto.nombre}" y guardado en la colección entregables!`));
        await this.pausePrompt();
      } catch (error) {
        console.clear();
        console.error(chalk.red(`Error al crear el entregable: ${error.message}`));
        await this.pausePrompt();
      } finally {
        await session.endSession();
      }
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error inesperado: ${error.message}`));
      await this.pausePrompt();
    }
  }
}
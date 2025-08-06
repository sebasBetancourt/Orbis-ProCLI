import { Comando } from "../Comando.js";
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { proyectoModel } from '../../../models/Proyectos.js';
import { entregableModel } from '../../../models/Entregables.js';

export class CambiarEntregable extends Comando {
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
      const seleccionarProyecto = async (mensaje = 'Selecciona un proyecto para cambiar un entregable:') => {
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

      // Verificar entregables
      const entregables = Array.isArray(proyecto.entregables) ? proyecto.entregables : [];
      if (entregables.length === 0) {
        console.clear();
        console.log(chalk.red(`El proyecto "${proyecto.nombre}" no tiene entregables. ❌`));
        await this.pausePrompt();
        return;
      }

      // Seleccionar acción primero
      console.clear();
      const questionsAccion = [
        {
          type: 'list',
          name: 'accion',
          message: chalk.yellow(`Selecciona una acción para los entregables del proyecto "${proyecto.nombre}":`),
          choices: [
            { name: chalk.cyan('1. Cambiar estado'), value: 'cambiar' },
            { name: chalk.red('2. Eliminar entregable'), value: 'eliminar' },
            { name: chalk.redBright.bold('0. Atrás'), value: 'salir' },
          ],
        },
      ];

      const { accion } = await inquirer.prompt(questionsAccion);

      if (accion === 'salir') {
        console.clear();
        console.log(chalk.red('Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      // Seleccionar entregable según la acción
      console.clear();
      let opcionesEntregables;
      if (accion === 'cambiar') {
        // Excluir entregables con estado 'aprobado'
        opcionesEntregables = entregables
          .map((entregable, index) => ({
            name: `${index + 1}. ${entregable.titulo} (Fecha Límite: ${dayjs(entregable.fechaLimite).format('YYYY-MM-DD')}, Estado: ${entregable.estado})`,
            value: { entregable, index },
          }))
          .filter(option => option.value.entregable.estado !== 'aprobado');
      } else {
        // Incluir todos los entregables para eliminar
        opcionesEntregables = entregables.map((entregable, index) => ({
          name: `${index + 1}. ${entregable.titulo} (Fecha Límite: ${dayjs(entregable.fechaLimite).format('YYYY-MM-DD')}, Estado: ${entregable.estado})`,
          value: { entregable, index },
        }));
      }

      if (opcionesEntregables.length === 0 && accion === 'cambiar') {
        console.clear();
        console.log(chalk.red(`No hay entregables disponibles para cambiar estado (todos están aprobados o no existen). ❌`));
        await this.pausePrompt();
        return;
      }

      opcionesEntregables.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

      const questionsEntregables = [
        {
          type: 'list',
          name: 'entregableSeleccionado',
          message: chalk.yellow(`\nEntregables del proyecto "${proyecto.nombre}":\n`),
          choices: opcionesEntregables,
        },
      ];

      const { entregableSeleccionado } = await inquirer.prompt(questionsEntregables);

      if (entregableSeleccionado === 'salir') {
        console.clear();
        console.log(chalk.red('Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      const { entregable, index } = entregableSeleccionado;

      if (accion === 'cambiar') {
        // Cambiar estado
        const questionsEstado = [
          {
            type: 'list',
            name: 'nuevoEstado',
            message: chalk.yellow('Selecciona el nuevo estado:'),
            choices: [
              { name: 'Pendiente', value: 'pendiente' },
              { name: 'Entregado', value: 'entregado' },
              { name: 'Aprobado', value: 'aprobado' },
              { name: 'Rechazado', value: 'rechazado' },
            ],
            validate: (input) => input !== entregable.estado ? true : 'El nuevo estado debe ser diferente al actual.',
          },
        ];

        const { nuevoEstado } = await inquirer.prompt(questionsEstado);

        // Iniciar transacción para actualizar estado
        const session = proyectoCollection.client.startSession();
        try {
          await session.withTransaction(async () => {
            // Actualizar en proyectos.entregables
            const updateFields = {
              $set: {
                [`entregables.${index}.estado`]: nuevoEstado
              },
            };

            // Incrementar avance si el estado es aprobado
            if (nuevoEstado === 'aprobado') {
              const avanceActual = proyecto.avances || 0;
              const nuevoAvance = Math.min(avanceActual + 25, 100);
              updateFields.$set.avances = nuevoAvance;
            }

            const resultProyecto = await proyectoCollection.updateOne(
              { _id: proyecto._id },
              updateFields,
              { session }
            );

            if (resultProyecto.modifiedCount === 0) {
              throw new Error('No se pudo actualizar el estado del entregable en el proyecto');
            }

            // Actualizar en colección entregables usando _id
            const resultEntregable = await entregableCollection.updateOne(
              { _id: entregable._id },
              { $set: { estado: nuevoEstado } },
              { session }
            );

            if (resultEntregable.matchedCount === 0) {
              throw new Error('No se encontró el entregable en la colección entregables');
            }
          });

          console.clear();
          console.log(chalk.green(`Estado del entregable "${entregable.titulo}" cambiado a "${nuevoEstado}" exitosamente!`));
          if (nuevoEstado === 'aprobado') {
            console.log(chalk.green(`Avance del proyecto actualizado`));
          }
          await this.pausePrompt();
        } finally {
          await session.endSession();
        }
      } else if (accion === 'eliminar') {
        // Confirmar eliminación
        console.clear();
        const questionsConfirmacion = [
          {
            type: 'confirm',
            name: 'confirmar',
            message: chalk.red(`¿Estás seguro de eliminar el entregable "${entregable.titulo}"⚠️?`),
            default: false,
          },
        ];

        const { confirmar } = await inquirer.prompt(questionsConfirmacion);

        if (!confirmar) {
          console.clear();
          console.log(chalk.red('Eliminación cancelada.'));
          await this.pausePrompt();
          return;
        }

        // Iniciar transacción para eliminar
        const session = proyectoCollection.client.startSession();
        try {
          await session.withTransaction(async () => {
            // Actualizar en proyectos.entregables y manejar avance
            const updateFields = {
              $pull: { entregables: { _id: entregable._id } }
            };

            // Restar avance si el entregable eliminado está aprobado
            if (entregable.estado === 'aprobado') {
              const avanceActual = proyecto.avances || 0;
              const nuevoAvance = Math.max(avanceActual - 25, 0);
              updateFields.$set.avances = nuevoAvance;
            }

            const resultProyecto = await proyectoCollection.updateOne(
              { _id: proyecto._id },
              updateFields,
              { session }
            );

            if (resultProyecto.modifiedCount === 0) {
              throw new Error('No se pudo eliminar el entregable del proyecto');
            }

            // Eliminar de colección entregables usando _id
            const resultEntregable = await entregableCollection.deleteOne(
              { _id: entregable._id },
              { session }
            );

            if (resultEntregable.deletedCount === 0) {
              throw new Error('No se encontró el entregable en la colección entregables');
            }
          });

          console.clear();
          console.log(chalk.green(`Entregable "${entregable.titulo}" eliminado exitosamente!`));
          if (entregable.estado === 'aprobado') {
            console.log(chalk.green(`Avance del proyecto actualizado a ${Math.max((proyecto.avances || 0) - 25, 0)}%`));
          }
          await this.pausePrompt();
        } finally {
          await session.endSession();
        }
      }
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error al cambiar/eliminar el entregable: ${error.message}`));
      await this.pausePrompt();
    } 
  }
}
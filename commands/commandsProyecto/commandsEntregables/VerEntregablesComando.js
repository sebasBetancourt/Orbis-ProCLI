import { Comando } from "../Comando.js";
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { proyectoModel } from '../../../models/Proyectos.js';

export class VerEntregables extends Comando {
  async ejecutar() {
    try {
      const proyectoCollection = await proyectoModel();

      // Función de selección de proyecto embebida, solo proyectos activos
      const seleccionarProyecto = async (mensaje = 'Selecciona un proyecto para ver sus entregables:') => {
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
            const pauseQuestions = [
              {
                type: 'input',
                name: 'continuar',
                message: chalk.blueBright('Presiona Enter para continuar...'),
              },
            ];
            await inquirer.prompt(pauseQuestions);
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
                const pauseQuestions = [
                  {
                    type: 'input',
                    name: 'continuar',
                    message: chalk.blueBright('Presiona Enter para volver...'),
                  },
                ];
                await inquirer.prompt(pauseQuestions);
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
        const pauseQuestions = [
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('Presiona Enter para continuar...'),
          },
        ];
        try {
          await inquirer.prompt(pauseQuestions);
        } catch (promptError) {
          console.error(chalk.red(`Error en el prompt de pausa: ${promptError.message}`));
        }
        return;
      }

      // Verificar entregables
      const entregables = Array.isArray(proyecto.entregables) ? proyecto.entregables : [];
      if (entregables.length === 0) {
        console.clear();
        console.log(chalk.red(`El proyecto "${proyecto.nombre}" no tiene entregables. ❌`));
        const pauseQuestions = [
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('Presiona Enter para continuar...'),
          },
        ];
        try {
          await inquirer.prompt(pauseQuestions);
        } catch (promptError) {
          console.error(chalk.red(`Error en el prompt de pausa: ${promptError.message}`));
        }
        return;
      }

      // Mostrar lista de entregables
      console.clear();
      const opcionesEntregables = entregables.map((entregable, index) => ({
        name: `${index + 1}. ${entregable.titulo} `,
        value: entregable,
      }));
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
        const pauseQuestions = [
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('Presiona Enter para continuar...'),
          },
        ];
        try {
          await inquirer.prompt(pauseQuestions);
        } catch (promptError) {
          console.error(chalk.red(`Error en el prompt de pausa: ${promptError.message}`));
        }
        return;
      }

      // Mostrar detalles del entregable
      console.clear();
      console.log(chalk.green.bold(`Detalles del entregable "${entregableSeleccionado.titulo}":`));
      console.log(chalk.cyan(`Título: ${entregableSeleccionado.titulo}`));
      console.log(chalk.cyan(`Fecha Límite: ${dayjs(entregableSeleccionado.fechaLimite).format('YYYY-MM-DD')}`));
      console.log(chalk.cyan(`Estado: ${entregableSeleccionado.estado}`));
      if (entregableSeleccionado.proyectoId) {
        console.log(chalk.cyan(`ID del Proyecto: ${entregableSeleccionado.proyectoId}`));
      }

      const pauseQuestions = [
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ];
      try {
        await inquirer.prompt(pauseQuestions);
      } catch (promptError) {
        console.error(chalk.red(`Error en el prompt de pausa: ${promptError.message}`));
      }
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error al ver los entregables: ${error.message}`));
      const pauseQuestions = [
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('Presiona Enter para continuar...'),
        },
      ];
      try {
        await inquirer.prompt(pauseQuestions);
      } catch (promptError) {
        console.error(chalk.red(`Error en el prompt de pausa: ${promptError.message}`));
      }
    }
  }
}
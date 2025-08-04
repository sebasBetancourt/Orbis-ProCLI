import inquirer from 'inquirer';
import chalk from 'chalk';
import { proyectoModel } from '../models/Proyectos.js';

export async function seleccionarProyectoPaginado(ProyectoModel, mensaje = 'Selecciona un Proyecto:', filtro = {}) {
  const pageSize = 3;
  let page = 0;
  let continuar = true;

  while (continuar) {
    const proyectos = await ProyectoModel.find(filtro)
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const totalProyectos = await ProyectoModel.countDocuments(filtro);

    if (proyectos.length === 0 && page === 0) {
      console.log(chalk.red.bold("\nNo hay proyectos disponibles para mostrar.❌\n"));
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

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

    const { proyectoSeleccionado } = await inquirer.prompt([
      {
        type: 'list',
        name: 'proyectoSeleccionado',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
      },
    ]);

    if (proyectoSeleccionado === 'anterior') {
      if (page > 0) page--;
      continue;
    }
    if (proyectoSeleccionado === 'siguiente') {
      page++;
      continue;
    }

    if (proyectoSeleccionado === 'busqueda') {
      const { textoBusqueda } = await inquirer.prompt([
        {
          type: 'input',
          name: 'textoBusqueda',
          message: chalk.cyan('🔍 Ingresa el nombre o parte del proyecto a buscar:'),
        },
      ]);

      let searchPage = 0;
      let searchContinuar = true;

      while (searchContinuar) {
        const searchFiltro = {
          ...filtro,
          nombre: { $regex: textoBusqueda, $options: 'i' },
        };

        const resultados = await ProyectoModel.find(searchFiltro)
          .skip(searchPage * pageSize)
          .limit(pageSize)
          .toArray();

        const totalResultados = await ProyectoModel.countDocuments(searchFiltro);

        if (resultados.length === 0) {
          console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
          searchContinuar = false;
          continue;
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

        const { proyectoEncontrado } = await inquirer.prompt([
          {
            type: 'list',
            name: 'proyectoEncontrado',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
          },
        ]);

        if (proyectoEncontrado === 'anteriorBusqueda') {
          if (searchPage > 0) searchPage--;
          continue;
        }
        if (proyectoEncontrado === 'siguienteBusqueda') {
          searchPage++;
          continue;
        }
        if (!proyectoEncontrado) {
          searchContinuar = false;
          continue;
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
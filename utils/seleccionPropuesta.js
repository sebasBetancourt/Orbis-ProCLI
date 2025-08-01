import inquirer from 'inquirer';
import chalk from 'chalk';
import { propuestaModel } from '../models/Propuestas.js';

export async function seleccionarPropuestaPaginado(PropuestaModel, mensaje = 'Selecciona una Propuesta:') {
  const pageSize = 3;
  let page = 0;
  let continuar = true;

  while (continuar) {
    const propuestas = await PropuestaModel.find()
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const totalPropuestas = await PropuestaModel.countDocuments();

    if (propuestas.length === 0 && page === 0) {
      console.log(chalk.red.bold("\nNo hay propuestas registradas.❌\n"));
      return null;
    }

    const opciones = propuestas.map((propuesta, index) => ({
      name: `${(page * pageSize) + index + 1}. ${propuesta.descripcion}`,
      value: propuesta,
    }));

    if (page > 0) {
      opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalPropuestas) {
      opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atras'), value: 'salir' });

    const { propuestaSeleccionada } = await inquirer.prompt([
      {
        type: 'list',
        name: 'propuestaSeleccionada',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
      },
    ]);

    if (propuestaSeleccionada === 'anterior') {
      if (page > 0) page--;
      continue;
    }
    if (propuestaSeleccionada === 'siguiente') {
      page++;
      continue;
    }

    if (propuestaSeleccionada === 'busqueda') {
      const { textoBusqueda } = await inquirer.prompt([
        {
          type: 'input',
          name: 'textoBusqueda',
          message: chalk.cyan('🔍 Ingresa la descripcion o parte de la propuesta a buscar:'),
        },
      ]);

      let searchPage = 0;
      let searchContinuar = true;

      while (searchContinuar) {
        const resultados = await PropuestaModel.find({
          descripcion: { $regex: textoBusqueda, $options: 'i' },
        })
          .skip(searchPage * pageSize)
          .limit(pageSize)
          .toArray();

        const totalResultados = await propuestaModel.countDocuments({
          descripcion: { $regex: textoBusqueda, $options: 'i' },
        });

        if (resultados.length === 0) {
          console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
          searchContinuar = false;
          continue;
        }

        const opcionesBusqueda = resultados.map((propuesta, index) => ({
          name: `${(searchPage * pageSize) + index + 1}. ${propuesta.descripcion}`,
          value: propuesta,
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

        const { propuestaEncontrada } = await inquirer.prompt([
          {
            type: 'list',
            name: 'propuestaEncontrada',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
          },
        ]);

        if (propuestaEncontrada === 'anteriorBusqueda') {
          if (searchPage > 0) searchPage--;
          continue;
        }
        if (propuestaEncontrada === 'siguienteBusqueda') {
          searchPage++;
          continue;
        }
        if (!propuestaEncontrada) {
          searchContinuar = false;
          continue;
        }

        return propuestaEncontrada;
      }
      continue;
    }

    if (propuestaSeleccionada === 'salir') {
      return null;
    }

    return propuestaSeleccionada;
  }
}
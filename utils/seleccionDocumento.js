import inquirer from 'inquirer';
import chalk from 'chalk';

export async function seleccionarDocumentoPaginado(CollectionModel, mensaje = 'Selecciona un documento:', campoBusqueda = 'nombre') {
  const pageSize = 3;
  let page = 0;
  let continuar = true;

  while (continuar) {
    const documentos = await CollectionModel.find()
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const totalDocumentos = await CollectionModel.countDocuments();

    if (documentos.length === 0 && page === 0) {
      console.log(chalk.red.bold(`\nNo hay documentos registrados.❌\n`));
      return null;
    }

    const opciones = documentos.map((doc, index) => ({
      name: `${(page * pageSize) + index + 1}. ${doc[campoBusqueda]}`,
      value: doc,
    }));

    if (page > 0) {
      opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalDocumentos) {
      opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atras'), value: 'salir' });

    const { documentoSeleccionado } = await inquirer.prompt([
      {
        type: 'list',
        name: 'documentoSeleccionado',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
      },
    ]);

    if (documentoSeleccionado === 'anterior') {
      if (page > 0) page--;
      continue;
    }
    if (documentoSeleccionado === 'siguiente') {
      page++;
      continue;
    }

    if (documentoSeleccionado === 'busqueda') {
      const { textoBusqueda } = await inquirer.prompt([
        {
          type: 'input',
          name: 'textoBusqueda',
          message: chalk.cyan(`🔍 Ingresa el nombre o parte del nombre a buscar:`),
        },
      ]);

      let searchPage = 0;
      let searchContinuar = true;

      while (searchContinuar) {
        const resultados = await CollectionModel.find({
          [campoBusqueda]: { $regex: textoBusqueda, $options: 'i' },
        })
          .skip(searchPage * pageSize)
          .limit(pageSize)
          .toArray();

        const totalResultados = await CollectionModel.countDocuments({
          [campoBusqueda]: { $regex: textoBusqueda, $options: 'i' },
        });

        if (resultados.length === 0) {
          console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
          searchContinuar = false;
          continue;
        }

        const opcionesBusqueda = resultados.map((doc, index) => ({
          name: `${(searchPage * pageSize) + index + 1}. ${doc[campoBusqueda]}`,
          value: doc,
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

        const { documentoEncontrado } = await inquirer.prompt([
          {
            type: 'list',
            name: 'documentoEncontrado',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
          },
        ]);

        if (documentoEncontrado === 'anteriorBusqueda') {
          if (searchPage > 0) searchPage--;
          continue;
        }
        if (documentoEncontrado === 'siguienteBusqueda') {
          searchPage++;
          continue;
        }
        if (!documentoEncontrado) {
          searchContinuar = false;
          continue;
        }

        return documentoEncontrado;
      }
      continue;
    }

    if (documentoSeleccionado === 'salir') {
      return null;
    }

    return documentoSeleccionado;
  }
}
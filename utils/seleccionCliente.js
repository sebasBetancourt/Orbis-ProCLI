import inquirer from 'inquirer';
import chalk from 'chalk';

export async function seleccionarClientePaginado(ClienteModel, mensaje = 'Selecciona un cliente:') {
  const pageSize = 3;
  let page = 0;
  let continuar = true;

  while (continuar) {
    const clientes = await ClienteModel.find()
      .skip(page * pageSize)
      .limit(pageSize)
      .toArray();

    const totalClientes = await ClienteModel.countDocuments();

    if (clientes.length === 0 && page === 0) {
      console.log(chalk.red.bold("\nNo hay clientes registrados.❌\n"));
      return null;
    }

    const opciones = clientes.map((cliente, index) => ({
      name: `${(page * pageSize) + index + 1}. ${cliente.nombre}`,
      value: cliente,
    }));

    if (page > 0) {
      opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalClientes) {
      opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atras'), value: 'salir' });

    const { clienteSeleccionado } = await inquirer.prompt([
      {
        type: 'list',
        name: 'clienteSeleccionado',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
      },
    ]);

    if (clienteSeleccionado === 'anterior') {
      if (page > 0) page--;
      continue;
    }
    if (clienteSeleccionado === 'siguiente') {
      page++;
      continue;
    }

    if (clienteSeleccionado === 'busqueda') {
      const { textoBusqueda } = await inquirer.prompt([
        {
          type: 'input',
          name: 'textoBusqueda',
          message: chalk.cyan('🔍 Ingresa el nombre o parte del nombre del cliente a buscar:'),
        },
      ]);

      let searchPage = 0;
      let searchContinuar = true;

      while (searchContinuar) {
        const resultados = await ClienteModel.find({
          nombre: { $regex: textoBusqueda, $options: 'i' },
        })
          .skip(searchPage * pageSize)
          .limit(pageSize)
          .toArray();

        const totalResultados = await ClienteModel.countDocuments({
          nombre: { $regex: textoBusqueda, $options: 'i' },
        });

        if (resultados.length === 0) {
          console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
          searchContinuar = false;
          continue;
        }

        const opcionesBusqueda = resultados.map((cliente, index) => ({
          name: `${(searchPage * pageSize) + index + 1}. ${cliente.nombre}`,
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

        const { clienteEncontrado } = await inquirer.prompt([
          {
            type: 'list',
            name: 'clienteEncontrado',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
          },
        ]);

        if (clienteEncontrado === 'anteriorBusqueda') {
          if (searchPage > 0) searchPage--;
          continue;
        }
        if (clienteEncontrado === 'siguienteBusqueda') {
          searchPage++;
          continue;
        }
        if (!clienteEncontrado) {
          searchContinuar = false;
          continue;
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
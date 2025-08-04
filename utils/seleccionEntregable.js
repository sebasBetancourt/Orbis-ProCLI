import inquirer from 'inquirer';
import chalk from 'chalk';

export async function seleccionarEntregablePaginado(EntregableModel, mensaje = 'Selecciona un entregable:') {
const pageSize = 3;
let page = 0;
let continuar = true;

while (continuar) {
    const entregables = await EntregableModel.find()
      .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

    const totalEntregables = await EntregableModel.countDocuments();

    if (entregables.length === 0 && page === 0) {
    console.log(chalk.red.bold("\nNo hay entregables registrados.❌\n"));
    return null;
    }

    const opciones = entregables.map((entregable, index) => ({
      name: `${(page * pageSize) + index + 1}. Proyecto: ${entregable.proyectoId}, Fecha límite: ${entregable.fechaLimite}, Estado: ${entregable.estado}`,
    value: entregable,
    }));

    if (page > 0) {
    opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalEntregables) {
    opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente 🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

    const { entregableSeleccionado } = await inquirer.prompt([
    {
        type: 'list',
        name: 'entregableSeleccionado',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
    },
    ]);

    if (entregableSeleccionado === 'anterior') {
    if (page > 0) page--;
    continue;
    }

    if (entregableSeleccionado === 'siguiente') {
    page++;
    continue;
    }

    if (entregableSeleccionado === 'busqueda') {
    const { textoBusqueda } = await inquirer.prompt([
        {
        type: 'input',
        name: 'textoBusqueda',
        message: chalk.cyan('🔍 Ingresa texto para buscar por proyectoId o estado:'),
        },
    ]);

    let searchPage = 0;
    let searchContinuar = true;

    while (searchContinuar) {
        const filtro = {
        $or: [
            { proyectoId: { $regex: textoBusqueda, $options: 'i' } },
            { estado: { $regex: textoBusqueda, $options: 'i' } },
        ]
        };

        const resultados = await EntregableModel.find(filtro)
          .skip(searchPage * pageSize)
        .limit(pageSize)
        .toArray();

        const totalResultados = await EntregableModel.countDocuments(filtro);

        if (resultados.length === 0) {
        console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
        searchContinuar = false;
        continue;
        }

        const opcionesBusqueda = resultados.map((entregable, index) => ({
          name: `${(searchPage * pageSize) + index + 1}. Proyecto: ${entregable.proyectoId}, Fecha: ${entregable.fechaLimite}, Estado: ${entregable.estado}`,
        value: entregable,
        }));

        if (searchPage > 0) {
        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anteriorBusqueda' });
        }

        if ((searchPage + 1) * pageSize < totalResultados) {
        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguienteBusqueda' });
        }

        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Volver'), value: null });

        const { entregableEncontrado } = await inquirer.prompt([
        {
            type: 'list',
            name: 'entregableEncontrado',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
        },
        ]);

        if (entregableEncontrado === 'anteriorBusqueda') {
        if (searchPage > 0) searchPage--;
        continue;
        }

        if (entregableEncontrado === 'siguienteBusqueda') {
        searchPage++;
        continue;
        }

        if (!entregableEncontrado) {
        searchContinuar = false;
        continue;
        }

        return entregableEncontrado;
    }

    continue;
    }

    if (entregableSeleccionado === 'salir') {
    return null;
    }

    return entregableSeleccionado;
}
}

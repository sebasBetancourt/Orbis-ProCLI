import inquirer from 'inquirer';
import chalk from 'chalk';

export async function seleccionarTransaccionPaginado(TransaccionModel, mensaje = 'Selecciona una transacción:') {
const pageSize = 3;
let page = 0;
let continuar = true;

while (continuar) {
    const transacciones = await TransaccionModel.find()
      .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

    const totalTransacciones = await TransaccionModel.countDocuments();

    if (transacciones.length === 0 && page === 0) {
    console.log(chalk.red.bold("\nNo hay transacciones registradas.❌\n"));
    return null;
    }

    const opciones = transacciones.map((t, i) => ({
      name: `${(page * pageSize) + i + 1}. 💳 Tipo: ${t.tipo} | 💵 Monto: $${t.monto} | 🗓 Fecha: ${new Date(t.fecha).toLocaleDateString()}`,
    value: t,
    }));

    if (page > 0) {
    opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalTransacciones) {
    opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente 🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

    const { transaccionSeleccionada } = await inquirer.prompt([
    {
        type: 'list',
        name: 'transaccionSeleccionada',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
    }
    ]);

    if (transaccionSeleccionada === 'anterior') {
    if (page > 0) page--;
    continue;
    }
    if (transaccionSeleccionada === 'siguiente') {
    page++;
    continue;
    }

    if (transaccionSeleccionada === 'busqueda') {
    const { textoBusqueda } = await inquirer.prompt([
        {
        type: 'input',
        name: 'textoBusqueda',
        message: chalk.cyan('🔍 Ingresa texto para buscar en tipo o descripción:'),
        }
    ]);

    let searchPage = 0;
    let buscar = true;

    while (buscar) {
        const filtro = {
        $or: [
            { tipo: { $regex: textoBusqueda, $options: 'i' } },
            { descripcion: { $regex: textoBusqueda, $options: 'i' } },
        ]
        };

        const resultados = await TransaccionModel.find(filtro)
          .skip(searchPage * pageSize)
        .limit(pageSize)
        .toArray();

        const totalResultados = await TransaccionModel.countDocuments(filtro);

        if (resultados.length === 0) {
        console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
        buscar = false;
        continue;
        }

        const opcionesBusqueda = resultados.map((t, i) => ({
          name: `${(searchPage * pageSize) + i + 1}. 💳 Tipo: ${t.tipo} | 💵 Monto: $${t.monto}`,
        value: t,
        }));

        if (searchPage > 0) {
        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anteriorBusqueda' });
        }
        if ((searchPage + 1) * pageSize < totalResultados) {
        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguienteBusqueda' });
        }

        opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Volver'), value: null });

        const { transaccionEncontrada } = await inquirer.prompt([
        {
            type: 'list',
            name: 'transaccionEncontrada',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
        }
        ]);

        if (transaccionEncontrada === 'anteriorBusqueda') {
        if (searchPage > 0) searchPage--;
        continue;
        }
        if (transaccionEncontrada === 'siguienteBusqueda') {
        searchPage++;
        continue;
        }
        if (!transaccionEncontrada) {
        buscar = false;
        continue;
        }

        return transaccionEncontrada;
    }
    continue;
    }

    if (transaccionSeleccionada === 'salir') {
    return null;
    }

    return transaccionSeleccionada;
}
}

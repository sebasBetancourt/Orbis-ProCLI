import inquirer from 'inquirer';
import chalk from 'chalk';

export async function seleccionarContratoPaginado(ContratoModel, mensaje = 'Selecciona un contrato:') {
const pageSize = 3;
let page = 0;
let continuar = true;

while (continuar) {
    const contratos = await ContratoModel.find()
      .skip(page * pageSize)
    .limit(pageSize)
    .toArray();

    const totalContratos = await ContratoModel.countDocuments();

    if (contratos.length === 0 && page === 0) {
    console.log(chalk.red.bold("\nNo hay contratos registrados.❌\n"));
    return null;
    }

    const opciones = contratos.map((contrato, index) => ({
      name: `${(page * pageSize) + index + 1}. ProyectoID: ${contrato.proyectoId.toString()}, Valor: $${contrato.valorTotal}`,
    value: contrato,
    }));

    if (page > 0) {
    opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
    }
    if ((page + 1) * pageSize < totalContratos) {
    opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
    }

    opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
    opciones.push({ name: chalk.redBright.bold('0. Atrás'), value: 'salir' });

    const { contratoSeleccionado } = await inquirer.prompt([
    {
        type: 'list',
        name: 'contratoSeleccionado',
        message: chalk.yellow(`\n${mensaje}\n`),
        choices: opciones,
    },
    ]);

    if (contratoSeleccionado === 'anterior') {
    if (page > 0) page--;
    continue;
    }
    if (contratoSeleccionado === 'siguiente') {
    page++;
    continue;
    }

    if (contratoSeleccionado === 'busqueda') {
    const { textoBusqueda } = await inquirer.prompt([
        {
        type: 'input',
        name: 'textoBusqueda',
        message: chalk.cyan('🔍 Ingresa texto para buscar en condiciones o proyectoId:'),
        },
    ]);

    let searchPage = 0;
    let searchContinuar = true;

    while (searchContinuar) {
        // Puedes ajustar los campos que quieres buscar
        const filtro = {
        $or: [
            { condiciones: { $regex: textoBusqueda, $options: 'i' } },
            { proyectoId: textoBusqueda }, // Busca por proyectoId exacto (string), ajusta si quieres ObjectId
        ]
        };

        const resultados = await ContratoModel.find(filtro)
          .skip(searchPage * pageSize)
        .limit(pageSize)
        .toArray();

        const totalResultados = await ContratoModel.countDocuments(filtro);

        if (resultados.length === 0) {
        console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
        searchContinuar = false;
        continue;
        }

        const opcionesBusqueda = resultados.map((contrato, index) => ({
          name: `${(searchPage * pageSize) + index + 1}. ProyectoID: ${contrato.proyectoId.toString()}, Valor: $${contrato.valorTotal}`,
        value: contrato,
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

        const { contratoEncontrado } = await inquirer.prompt([
        {
            type: 'list',
            name: 'contratoEncontrado',
            message: chalk.yellow('\nResultados encontrados:'),
            choices: opcionesBusqueda,
        },
        ]);

        if (contratoEncontrado === 'anteriorBusqueda') {
        if (searchPage > 0) searchPage--;
        continue;
        }
        if (contratoEncontrado === 'siguienteBusqueda') {
        searchPage++;
        continue;
        }
        if (!contratoEncontrado) {
        searchContinuar = false;
        continue;
        }

        return contratoEncontrado;
    }
    continue;
    }

    if (contratoSeleccionado === 'salir') {
    return null;
    }

    return contratoSeleccionado;
}
}

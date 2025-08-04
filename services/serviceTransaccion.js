import { CrearTransaccionComando } from "../commands/commandsTransaccion/CrearTransaccionComando.js";
import { ListarTransaccionComando } from "../commands/commandsTransaccion/VerTransaccionesComando.js";
import { EliminarTransaccionComando } from "../commands/commandsTransaccion/EliminarTransaccionComando.js";
import { CalcularBalanceComando } from "../commands/commandsTransaccion/CalcularBalanceComando.js";

export class TransaccionService {
async crearTransaccion() {
    const comando = new CrearTransaccionComando();
    await comando.ejecutar();
}

async listarTransacciones() {
    const comando = new ListarTransaccionComando();
    await comando.ejecutar();
}

async eliminarTransaccion() {
    const comando = new EliminarTransaccionComando();
    await comando.ejecutar();
}

async calcularBalance() {
    const comando = new CalcularBalanceComando();
    await comando.ejecutar();
}
}

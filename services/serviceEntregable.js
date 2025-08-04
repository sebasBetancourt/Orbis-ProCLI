import { EliminarEntregableComando } from "../commands/commandsEntregables/EliminarEntregableComando.js";

export class EntregableService {
async listarEntregable() {
    console.clear();
    console.log("Caso 1: Listar entregables (no implementado).");
}

async crearEntregable() {
    console.clear();
    console.log("Caso 2: Crear entregable (no implementado).");
}

async actualizarEntregable() {
    console.clear();
    console.log("Caso 3: Actualizar entregable (no implementado).");
}

async eliminarEntregable() {
    const comando = new EliminarEntregableComando();
    await comando.ejecutar();  // caso 4: eliminar entregable implementado
}
}

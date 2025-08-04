import { CrearContratoComando } from "../commands/commandsContratos/CrearContratoComando.js";
import { ListarContratoComando } from "../commands/commandsContratos/ListarContratoComando.js";
import { EliminarContratoComando } from "../commands/commandsContratos/EliminarContratoComando.js";
import { ActualizarContratoComando } from "../commands/commandsContratos/ActualizarContratoComando.js";

export class ContratoService {
  async listarContrato() {
    const comando = new ListarContratoComando();
    await comando.ejecutar();
  }

  async crearContrato() {
    const comando = new CrearContratoComando();
    await comando.ejecutar(); // caso 1: registrar contrato
  }

  async actualizarContrato() {
    const comando = new ActualizarContratoComando();
    await comando.ejecutar(); // caso 3: actualizar contrato
  }

  async eliminarContrato() {
    const comando = new EliminarContratoComando();
    await comando.ejecutar(); // caso 4: eliminar contrato
  }
}

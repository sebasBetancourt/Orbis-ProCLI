// services/serviceContrato.js

import { CrearContratoComando } from "../commands/commandsContratos/CrearContratoComando.js";
import { ListarContratoComando } from "../commands/commandsContratos/ListarContratoComando.js";
import { EliminarContratoComando } from "../commands/commandsContratos/EliminarContratoComando.js";

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
    console.log('casi (3)'); // caso 3: editar contrato
  }

  async eliminarContrato() {
    const comando = new EliminarContratoComando();
    await comando.ejecutar(); // caso 4: eliminar contrato
  }
}

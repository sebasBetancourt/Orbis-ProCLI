import { CrearClienteComando } from "../commands/commandsClient/CrearClienteComando.js";
import { ListarClienteComando } from "../commands/commandsClient/ListarClienteComando.js";
import { ActualizarClienteComando } from "../commands/commandsClient/ActualizarClienteComando.js";
import { EliminarClienteComando } from "../commands/commandsClient/EliminarClienteComando.js";

export class ClienteService {
  async crearCliente() {
    const comando = new CrearClienteComando();
    await comando.ejecutar()
  }

  async listarCliente() {
    const comando = new ListarClienteComando();
    await comando.ejecutar()
  }

  async actualizarCliente() {
    const comando = new ActualizarClienteComando();
    await comando.ejecutar()
  }

  async eliminarCliente() {
    const comando = new EliminarClienteComando();
    await comando.ejecutar()
  }

}

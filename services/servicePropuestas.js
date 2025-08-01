import { CrearPropuestaComando } from '../commands/commandsPropuesta/CrearPropuestaComando.js';
import { ListarPropuestaComando } from '../commands/commandsPropuesta/ListarPropuestaComando.js';
import { ActualizarPropuestaComando } from '../commands/commandsPropuesta/ActualizarPropuestaComando.js';
import { EliminarPropuestaComando } from '../commands/commandsPropuesta/EliminarPropuestaComando.js';

export class PropuestaService {
  async crearPropuesta() {
    try {
      const comando = new CrearPropuestaComando();
      await comando.ejecutar();
    } catch (error) {
      console.error(error);
      
    }
  };

  async listarPropuestas() {
    const comando = new ListarPropuestaComando();
    await comando.ejecutar();
  };

  async actualizarPropuesta() {
    const comando = new ActualizarPropuestaComando();
    await comando.ejecutar();
  };

  async eliminarPropuesta() {
    const comando = new EliminarPropuestaComando();
    await comando.ejecutar();
  };
}
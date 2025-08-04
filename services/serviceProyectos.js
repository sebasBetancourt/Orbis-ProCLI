import { ListarPropuestaComando } from "../commands/commandsPropuesta/ListarPropuestaComando.js";
import { ActualizarProyectoComando } from "../commands/commandsProyecto/ActualizarProyectoComando.js";
import { EliminarProyectoComando } from "../commands/commandsProyecto/EliminarProyectoComando.js";
import { RegistrarAvanceComando } from "../commands/commandsProyecto/RegistrarAvanceComando.js";

export class ProyectoService {
  async listarProyectos() {
    try {
      const comando = new ListarPropuestaComando();
      await comando.ejecutar();
    } catch (error) {
      console.error(error);
    }
  };

  async actualizarProyecto() {
    try {
      const comando = new ActualizarProyectoComando();
      await comando.ejecutar();
    } catch (error) {
      console.error("Error al Ejecutar Comando Actualizar");
    }
  };

  async eliminarProyecto() {
    const comando = new EliminarProyectoComando();
    await comando.ejecutar();
  };

  async registrarAvance() {
    try {
      const comando = new RegistrarAvanceComando();
      await comando.ejecutar();
    } catch (error) {
      console.error("Error al Ejecutar Comando Registrar Avance");
    }
  };
}
import { CrearFinanzaComando } from '../commands/commandsFinanzas/CrearFinanzaComando.js';
import { ListarFinanzasComando } from '../commands/commandsFinanzas/ListarFinanzasComando.js';
import { ActualizarFinanzaComando } from '../commands/commandsFinanzas/ActualizarFInanzasComando.js';
import { EliminarFinanzaComando } from '../commands/commandsFinanzas/EliminarFinanzasComando.js';
import { CalcularBalanceComando } from '../commands/commandsFinanzas/CalcularBalanceComando.js';

export class FinanzaService {
  async crearFinanza() {
    try {
      const comando = new CrearFinanzaComando();
      await comando.ejecutar();
    } catch (error) {
      console.error('Error al crear finanza:', error.message);
    }
  }

  async listarFinanzas() {
    try {
      const comando = new ListarFinanzasComando();
      await comando.ejecutar();
    } catch (error) {
      console.error('Error al listar finanzas:', error.message);
    }
  }

  async actualizarFinanza() {
    try {
      const comando = new ActualizarFinanzaComando();
      await comando.ejecutar();
    } catch (error) {
      console.error('Error al actualizar finanza:', error.message);
    }
  }

  async eliminarFinanza() {
    try {
      const comando = new EliminarFinanzaComando();
      await comando.ejecutar();
    } catch (error) {
      console.error('Error al eliminar finanza:', error.message);
    }
  }

  async calcularBalance() {
    try {
      const comando = new CalcularBalanceComando();
      await comando.ejecutar();
    } catch (error) {
      console.error('Error al calcular balance:', error.message);
    }
  }
}
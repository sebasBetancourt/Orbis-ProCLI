import { Ingresos } from "../commands/commandsEstadofinanciero/comandoIngresos.js";
import { egresos } from "../commands/commandsEstadofinanciero/comandoegresos.js";
import {  balance } from "../commands/commandsEstadofinanciero/comandobalance.js";

export class EstadoService {
  async VerIngresos() {
    const comando = new Ingresos();
    await comando.ejecutar();
  }

  async VerEgresos() {
    const comando = new egresos();
    await comando.ejecutar(); // caso 1: registrar contrato
  }

  async Verbalance() {
    const comando = new balance();
    await comando.ejecutar(); // caso 3: actualizar contrato
  }

}

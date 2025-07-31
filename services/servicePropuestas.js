import chalk from 'chalk';
import { PropuestaFactory } from '../models/Propuestas.js';
import { pedirDatosPropuesta } from '../utils/pedirDatosPropuesta.js';

// Responsabilidad: Lógica de negocio para propuestas (SRP)
// DIP: Depende de la abstracción Repositorio, no de la implementación concreta
export class PropuestaService {
  constructor(repositorio, proyectoService) {
    this.repositorio = repositorio; // Inyección de dependencia (DIP)
    this.proyectoService = proyectoService; // Para generar proyectos automáticamente
  }

  async crearPropuesta() {
    // Lógica para recolectar datos y crear propuesta (implementada por ti)
    console.log(chalk.blue('Creando nueva propuesta...'));
    // Ejemplo: const datos = await pedirDatosPropuesta();
    // const propuesta = PropuestaFactory.crearPropuesta(datos);
    // await this.repositorio.insertarPropuesta(propuesta);
  }

  async listarPropuestas() {
    // Lógica para listar propuestas (implementada por ti)
    console.log(chalk.yellow.bold('Lista de Propuestas:'));
    // Ejemplo: const propuestas = await this.repositorio.obtenerPropuestas();
  }

  async actualizarEstadoPropuesta(propuestaId, nuevoEstado) {
    // Lógica para actualizar estado (implementada por ti)
    console.log(chalk.blue('Actualizando estado de propuesta...'));
    // Si el estado es 'aceptada', generar proyecto
    if (nuevoEstado === 'aceptada') {
      // const propuesta = await this.repositorio.obtenerPropuestaPorId(propuestaId);
      // await PropuestaFactory.crearProyectoDesdePropuesta(propuesta, this.proyectoService);
    }
  }

  async eliminarPropuesta(propuestaId) {
    // Lógica para eliminar propuesta (implementada por ti)
    console.log(chalk.blue('Eliminando propuesta...'));
    // Ejemplo: await this.repositorio.eliminarPropuesta(propuestaId);
  }
}
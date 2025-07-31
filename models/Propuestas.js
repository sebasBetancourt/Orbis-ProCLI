// Responsabilidad: Modelo de datos para Propuesta con validaciones (SRP)
// LSP: Puede ser extendido para tipos específicos de propuestas sin romper el comportamiento
export class Propuesta {
  constructor({ id, clienteId, descripcion, precio, plazo, estado, fechaCreacion }) {
    this._id = id || null; // ObjectId de MongoDB (opcional, asignado por la BD)
    this.clienteId = clienteId; // Referencia al cliente (ObjectId)
    this.descripcion = descripcion;
    this.precio = precio;
    this.plazo = plazo; // En días
    this.estado = estado || 'pendiente'; // pendiente, aceptada, rechazada
    this.fechaCreacion = fechaCreacion || new Date();

    this.validar(); // Validar al crear la instancia
  }

  // Validaciones de campos (requeridos, tipos, rangos)
  validar() {
    if (!this.clienteId) throw new Error('El cliente es requerido');
    if (typeof this.descripcion !== 'string' || !this.descripcion.trim())
      throw new Error('La descripción es requerida y debe ser una cadena');
    if (typeof this.precio !== 'number' || this.precio <= 0)
      throw new Error('El precio debe ser un número mayor a 0');
    if (typeof this.plazo !== 'number' || this.plazo <= 0)
      throw new Error('El plazo debe ser un número mayor a 0');
    if (!['pendiente', 'aceptada', 'rechazada'].includes(this.estado))
      throw new Error('Estado inválido');
  }

  // Método para mostrar datos (para consola)
  mostrarPropuesta(clienteNombre) {
    return `Propuesta: ${this.descripcion}, Cliente: ${clienteNombre}, Precio: $${this.precio}, Plazo: ${this.plazo} días, Estado: ${this.estado}`;
  }
}

// Factory Method: Crear instancias de Propuesta (OCP: extensible para nuevos tipos de propuestas)
export class PropuestaFactory {
  static crearPropuesta(datos) {
    return new Propuesta(datos);
  }

  // Método para crear proyecto desde propuesta aceptada
  static async crearProyectoDesdePropuesta(propuesta, proyectoService) {
    const proyectoDatos = {
      clienteId: propuesta.clienteId,
      nombre: `Proyecto: ${propuesta.descripcion}`,
      descripcion: propuesta.descripcion,
      estado: 'activo',
      fechaInicio: new Date(),
    };
    return proyectoService.crearProyecto(proyectoDatos); // Delega al servicio de proyectos
  }
}
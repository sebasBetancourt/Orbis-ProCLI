// Interfaz abstracta para el repositorio (DIP, ISP)
export class Repositorio {
  async insertarPropuesta(propuesta) {
    throw new Error('Método insertarPropuesta no implementado');
  }
  async obtenerPropuestas() {
    throw new Error('Método obtenerPropuestas no implementado');
  }
  async obtenerPropuestaPorId(id) {
    throw new Error('Método obtenerPropuestaPorId no implementado');
  }
  async actualizarPropuesta(propuestaId, datos) {
    throw new Error('Método actualizarPropuesta no implementado');
  }
  async eliminarPropuesta(propuestaId) {
    throw new Error('Método eliminarPropuesta no implementado');
  }
}

// Implementación concreta para MongoDB (Patrón Repository)
export class RepositorioMongo extends Repositorio {
  constructor(clienteMongo) {
    super();
    this.clienteMongo = clienteMongo;
    this.db = null;
  }

  async conectar() {
    if (!this.db) {
      const client = await this.clienteMongo.connect();
      this.db = client.db('freelancer_db');
    }
  }

  async insertarPropuesta(propuesta) {
    await this.conectar();
    const session = this.clienteMongo.startSession();
    let resultado;
    try {
      await session.withTransaction(async () => {
        // Lógica de inserción con transacción (implementada por ti)
        // Ejemplo: resultado = await this.db.collection('propuestas').insertOne(propuesta, { session });
      });
      return resultado;
    } finally {
      await session.endSession();
    }
  }

  async obtenerPropuestas() {
    await this.conectar();
    // Lógica para obtener propuestas (implementada por ti)
    // Ejemplo: return await this.db.collection('propuestas').find().toArray();
  }

  // Otros métodos (obtenerPorId, actualizar, eliminar) implementados por ti
}
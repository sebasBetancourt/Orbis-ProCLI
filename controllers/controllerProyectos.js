// controllerProyecto.js
import { AceptarPropuestaYGenerarProyectoComando } from '../commands/commandsPropuesta/AceptarPropuestaYGenerarProyectoComando.js';
import { ListarProyectosComando } from '../commands/commandsProyecto/ListarProyectosComando.js';
import { ActualizarProyectoComando } from '../commands/commandsProyecto/ActualizarProyectoComando.js';
import { EliminarProyectoComando } from '../commands/commandsProyecto/EliminarProyectoComando.js';
import { RegistrarAvanceComando } from '../commands/commandsProyecto/RegistrarAvanceComando.js';

export async function controllerProyecto(opcion) {
    try {
        let comando;

        switch (opcion) {
            case '1':
                comando = new AceptarPropuestaYGenerarProyectoComando();
                break;
            case '2':
                comando = new ListarProyectosComando();
                break;
            case '3':
                comando = new ActualizarProyectoComando();
                break;
            case '4':
                comando = new EliminarProyectoComando();
                break;
            case '5':
                comando = new RegistrarAvanceComando();
                break;
            default:
                console.log("Opción no válida.");
                return;
        }

        if (comando) {
            await comando.ejecutar();
        }
    } catch (error) {
        console.error("Error en el controlador de proyectos:", error.message);
    }
}
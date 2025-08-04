import { mostrarMenuProyectos } from '../helpers/menuProyectos.js';
import { ListarProyectosComando } from '../commands/commandsProyecto/ListarProyectosComando.js';
import { ActualizarProyectoComando } from '../commands/commandsProyecto/ActualizarProyectoComando.js';
import { EliminarProyectoComando } from '../commands/commandsProyecto/EliminarProyectoComando.js';
import { RegistrarAvanceComando } from '../commands/commandsProyecto/RegistrarAvanceComando.js';

export async function controllerProyecto() {
    let opcion = '';

    do {
        opcion = await mostrarMenuProyectos();

        try {
            let comando;

            switch (opcion) {
                case '1':
                    console.log('Error');
                    
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
                case '0':
                    console.log('Volviendo al menú principal...');
                    return;
                default:
                    console.log("Opción no válida.");
            }

            if (comando) {
                await comando.ejecutar();
            }

        } catch (error) {
            console.error("Error en el controlador de proyectos:", error.message);
        }

    } while (opcion !== '0');
}
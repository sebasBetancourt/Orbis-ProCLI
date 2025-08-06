import chalk from 'chalk';
import { mostrarMenuEntregables } from '../../helpers/menuEntregables';
import { VerEntregables } from './commandsEntregables/VerEntregablesComando.js';
import { CrearEntregable } from './commandsEntregables/CrearEntregableComando.js'
import { CambiarEntregable } from './commandsEntregables/CambiarEntregableComando.js'


export class RegistrarAvanceComando {
    async ejecutar() {
        async function main() {
          let salir = false;
        
          while (!salir) {
            const opcion = await mostrarMenuEntregables();
        
            switch (opcion) {
              case '1':
                await VerEntregables();
                break;
        
              case '2':
                await CrearEntregable();
                break;
              case '3':
               await CambiarEntregable();
               break;
              case '0':
                salir = true;
                console.log(chalk.red.bold('Volviendo al menú principal...'));
                break;
              default:
                console.log(chalk.red('Opción no válida'));
            }
          }
        }
        
        main();
    }
}
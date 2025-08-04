import { Comando } from './comando.js';  // ajusta la ruta si es necesario
import chalk from 'chalk';

export class CalcularBalanceComando extends Comando {
  async ejecutar() {
    console.log(chalk.blueBright('Calculando Balance...'));
  }
}


import { Comando } from './Comando.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import { RegistrarIngreso } from './RegistrarIngresoComando.js';
import { RegistrarEgreso } from './RegistrarEgresoComando.js';
import { CalcularBalanceCliente } from './CalcularBalanceCliente.js';
import { CalcularBalanceFecha } from './CalcularBalanceFechaComando.js';

export class GestionFinanciera extends Comando {
  async pausePrompt(message = 'Presiona Enter para continuar...') {
    const pauseQuestions = [
      {
        type: 'input',
        name: 'continuar',
        message: chalk.blueBright(message),
      },
    ];
    await inquirer.prompt(pauseQuestions);
  }

  async ejecutar() {
    try {
      console.clear();
      const questions = [
        {
          type: 'list',
          name: 'opcion',
          message: chalk.yellow('Selecciona una opción de gestión financiera:'),
          choices: [
            { name: chalk.cyan('1. Registrar ingreso'), value: 'ingreso' },
            { name: chalk.cyan('2. Registrar egreso'), value: 'egreso' },
            { name: chalk.cyan('3. Calcular balance por cliente'), value: 'balanceCliente' },
            { name: chalk.cyan('4. Calcular balance por fecha'), value: 'balanceFecha' },
            { name: chalk.redBright.bold('0. Atrás'), value: 'salir' },
          ],
        },
      ];

      const { opcion } = await inquirer.prompt(questions);

      if (opcion === 'salir') {
        console.clear();
        console.log(chalk.red('Operación cancelada.'));
        await this.pausePrompt();
        return;
      }

      let comando;
      switch (opcion) {
        case 'ingreso':
          comando = new RegistrarIngreso();
          break;
        case 'egreso':
          comando = new RegistrarEgreso();
          break;
        case 'balanceCliente':
          comando = new CalcularBalanceCliente();
          break;
        case 'balanceFecha':
          comando = new CalcularBalanceFecha();
          break;
        default:
          throw new Error('Opción no válida');
      }

      await comando.ejecutar();
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error en gestión financiera: ${error.message}`));
      await this.pausePrompt();
    } 
  }
}
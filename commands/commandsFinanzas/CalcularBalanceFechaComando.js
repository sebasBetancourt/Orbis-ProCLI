import { Comando } from './Comando.js';
import inquirer from 'inquirer';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { finanzaModel } from '../../models/Finanzas.js';

export class CalcularBalanceFecha extends Comando {
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
      const finanzaCollection = await finanzaModel();

      console.clear();
      const questions = [
        {
          type: 'input',
          name: 'fechaInicio',
          message: chalk.yellow('Ingresa la fecha de inicio (YYYY-MM-DD):'),
          validate: (input) => {
            const fecha = dayjs(input, 'YYYY-MM-DD', true);
            return fecha.isValid() ? true : 'La fecha debe ser válida en formato YYYY-MM-DD';
          },
        },
        {
          type: 'input',
          name: 'fechaFin',
          message: chalk.yellow('Ingresa la fecha de fin (YYYY-MM-DD):'),
          validate: (input, answers) => {
            const fechaFin = dayjs(input, 'YYYY-MM-DD', true);
            const fechaInicio = dayjs(answers.fechaInicio, 'YYYY-MM-DD', true);
            if (!fechaFin.isValid()) {
              return 'La fecha debe ser válida en formato YYYY-MM-DD';
            }
            if (fechaFin.isBefore(fechaInicio)) {
              return 'La fecha de fin debe ser igual o posterior a la fecha de inicio';
            }
            return true;
          },
        },
      ];

      const { fechaInicio, fechaFin } = await inquirer.prompt(questions);

      console.clear();
      const finanzas = await finanzaCollection.find({
        fecha: {
          $gte: dayjs(fechaInicio).startOf('day').toDate(),
          $lte: dayjs(fechaFin).endOf('day').toDate(),
        },
      }).toArray();

      const ingresos = finanzas
        .filter(f => f.tipo === 'ingreso')
        .reduce((sum, f) => sum + f.monto, 0);
      const egresos = finanzas
        .filter(f => f.tipo === 'egreso')
        .reduce((sum, f) => sum + f.monto, 0);
      const balance = ingresos - egresos;

      console.clear();
      console.log(chalk.yellow(`Balance financiero desde ${fechaInicio} hasta ${fechaFin}:`));
      console.log(chalk.cyan(`Ingresos totales: ${ingresos.toFixed(2)}`));
      console.log(chalk.red(`Egresos totales: ${egresos.toFixed(2)}`));
      console.log(chalk.green(`Balance: ${balance.toFixed(2)}`));
      if (finanzas.length > 0) {
        console.log(chalk.yellow('\nTransacciones:'));
        finanzas.forEach(f => {
          console.log(
            `${f.tipo === 'ingreso' ? chalk.cyan('+') : chalk.red('-')} ${f.monto.toFixed(2)} - ${f.descripcion} (${dayjs(f.fecha).format('YYYY-MM-DD')})`
          );
        });
      } else {
        console.log(chalk.red('No hay transacciones en el rango de fechas seleccionado.'));
      }
      await this.pausePrompt();
    } catch (error) {
      console.clear();
      console.error(chalk.red(`Error al calcular balance: ${error.message}`));
      await this.pausePrompt();
    }
  }
}
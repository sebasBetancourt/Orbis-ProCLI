import inquirer from 'inquirer';
import chalk from 'chalk';
import { proyectoModel } from '../models/Proyectos.js';
import { ObjectId } from 'mongodb';

export async function pedirDatosFinanza() {
  const proyectoCollection = await proyectoModel();
  const proyectos = await proyectoCollection.find().toArray();
  const opciones = proyectos.map((proyecto) => ({
    name: `${proyecto.nombre}`,
    value: proyecto._id.toString(),
  }));

  const respuestas = await inquirer.prompt([
    {
      type: 'list',
      name: 'proyectoId',
      message: chalk.cyan('Selecciona el proyecto asociado:'),
      choices: opciones,
    },
    {
      type: 'list',
      name: 'tipo',
      message: chalk.cyan('Selecciona el tipo de registro:'),
      choices: ['ingreso', 'egreso'],
    },
    {
      type: 'input',
      name: 'concepto',
      message: chalk.cyan('Ingresa el concepto:'),
      validate: (input) => input.trim() !== '' || 'El concepto no puede estar vacío',
    },
    {
      type: 'number',
      name: 'monto',
      message: chalk.cyan('Ingresa el monto:'),
      validate: (input) => input > 0 || 'El monto debe ser mayor a 0',
    },
    {
      type: 'input',
      name: 'fecha',
      message: chalk.cyan('Ingresa la fecha (YYYY-MM-DD):'),
      validate: (input) => /^\d{4}-\d{2}-\d{2}$/.test(input) || 'Formato inválido',
    },
  ]);

  return {
    ...respuestas,
    proyectoId: new ObjectId(respuestas.proyectoId),
    fecha: new Date(respuestas.fecha),
  };
}
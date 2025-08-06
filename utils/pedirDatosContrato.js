import { input } from '@inquirer/prompts';
import chalk from 'chalk';
import dayjs from 'dayjs';
import { proyectoModel } from '../models/Proyectos.js';
import { propuestaModel } from '../models/Propuestas.js';

export async function datosContrato(proyectoId) {
  const hoy = dayjs('2025-08-05');

  const fechaInicio = await input({
    message: 'Ingresa la fecha de inicio (formato YYYY-MM-DD, a partir de 2025-08-05)📆:',
    validate: (input) => {
      const fecha = dayjs(input.trim(), 'YYYY-MM-DD', true);
      if (!fecha.isValid()) {
        return 'Debes ingresar una fecha válida en formato YYYY-MM-DD';
      }
      const year = fecha.year();
      const month = fecha.month() + 1;
      const day = fecha.date();
      if (year < 2025 || fecha.isBefore(hoy, 'day')) {
        return 'La fecha de inicio debe ser el 5 de agosto de 2025 o posterior';
      }
      if (month < 1 || month > 12) {
        return 'El mes debe estar entre 01 y 12';
      }
      if (day < 1 || day > fecha.daysInMonth()) {
        return `El día debe estar entre 01 y ${fecha.daysInMonth()} para el mes ${month}`;
      }
      return true;
    }
  });

  const fechaFin = await input({
    message: 'Ingresa la fecha de finalización (formato YYYY-MM-DD, posterior a fecha de inicio)📆:',
    validate: (input) => {
      const fechaFinD = dayjs(input.trim(), 'YYYY-MM-DD', true);
      if (!fechaFinD.isValid()) {
        return 'Debes ingresar una fecha válida en formato YYYY-MM-DD';
      }
      const year = fechaFinD.year();
      const month = fechaFinD.month() + 1;
      const day = fechaFinD.date();
      if (year < 2025 || fechaFinD.isBefore(hoy, 'day')) {
        return 'La fecha de finalización debe ser el 5 de agosto de 2025 o posterior';
      }
      if (month < 1 || month > 12) {
        return 'El mes debe estar entre 01 y 12';
      }
      if (day < 1 || day > fechaFinD.daysInMonth()) {
        return `El día debe estar entre 01 y ${fechaFinD.daysInMonth()} para el mes ${month}`;
      }
      const fechaInicioD = dayjs(fechaInicio, 'YYYY-MM-DD', true);
      if (fechaFinD.isBefore(fechaInicioD, 'day') || fechaFinD.isSame(fechaInicioD, 'day')) {
        return 'La fecha de finalización debe ser posterior a la fecha de inicio';
      }
      return true;
    }
  });

  const condiciones = await input({
    message: 'Ingresa las condiciones del proyecto:',
    validate: (input) => input.trim() !== '' || 'El campo "condiciones" no puede estar vacío.'
  });

  const fechaInicioDate = dayjs(fechaInicio).toDate();
  const fechaFinDate = dayjs(fechaFin).toDate();

  const proyectoCollection = await proyectoModel();
  const propuestaCollection = await propuestaModel();

  const proyecto = await proyectoCollection.findOne({ _id: proyectoId });
  if (!proyecto) {
    throw new Error('Proyecto no encontrado');
  }
  const idpropuesta = proyecto.propuestaId;

  const propuesta = await propuestaCollection.findOne({ _id: idpropuesta }, { projection: { precio: 1 } });
  if (!propuesta) {
    throw new Error('Propuesta no encontrada');
  }
  const valorTotal = propuesta.precio;

  return {
    fechaInicio: fechaInicioDate,
    fechaFin: fechaFinDate,
    condiciones,
    valorTotal
  };
}
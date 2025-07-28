import inquirer from 'inquirer';
import { mensageMenu } from '../utils/utils.js';

export default async function mostrarMenu() {
  const { opcion } = await inquirer.prompt([
    {
      type: 'list',
      name: 'opcion',
      message: `${mensageMenu()}`,
      choices: [
        { name: ('1. Administar Clientes'), value: '1' },
        { name: ('2. Administar Propuestas'), value: '2' },
        { name: ('3. Administar Proyectos'), value: '3' },
        { name: ('4. Administar Contratos'), value: '4' },
        { name: ('5. Administar Entregables'), value: '5' },
        { name: ('6. Administar Gestion Financiera'), value: '6' },
        { name: ('0. Salir'), value: '0' }
      ]
    }
  ]);
  return opcion;
}
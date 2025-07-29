import inquirer from "inquirer";
import chalk from "chalk";

export async function datosCliente() {

    const { nombreCliente } = await inquirer.prompt([
        {
          type: 'input',
          name: 'nombreCliente',
          message: 'Ingresa el nombre del Cliente🙎: ',
          validate: input => {
              const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
        
              if (!input.trim()) {
                return chalk.red.bold('El nombre no puede estar vacío');
              } else if (!regex.test(input)) {
                return chalk.red.bold('El nombre solo puede contener letras y espacios');
              }
              return true; 
            }
        }
      ]);


      const { emailCliente } = await inquirer.prompt([
          {
              type: 'input',
              name: 'emailCliente',
              message: 'Ingresa el email del Cliente🙎: ',
              validate: input => {
                const regex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;

                if (!input.trim()){
                  return chalk.red.bold('El email no puede estar vacio');
                } else if (!regex.test(input)){
                  return chalk.red.bold('El email no puede ser erroneo');
                }
                return true; 
              }
          }
      ]);


      const { telefonoCliente } = await inquirer.prompt([
        {
            type: 'input',
            name: 'telefonoCliente',
            message: 'Ingresa el telefono del Cliente🙎: ',
            validate: input => {
                const regex = /^[0-9]{7,13}$/;

              if (!input.trim()){
                return chalk.red.bold('El telefono no puede estar vacio');
              } else if (!regex.test(input)){
                return chalk.red.bold('El telefono debe ser valido');
              }
              return true; 
            }
        }
    ]);


    return { nombreCliente, emailCliente, telefonoCliente }
}
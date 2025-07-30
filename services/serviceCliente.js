import { Client, clienteModel } from "../models/Cliente.js";
import inquirer from 'inquirer';
import { connection } from "../config/db.js";
import chalk from "chalk";
import { datosCliente } from "../utils/pedirDatosCliente.js";

export class ClienteService{

    async crearCliente(){
        const { nombreCliente, emailCliente, telefonoCliente } = await datosCliente()
        const ClienteModel = await clienteModel();
        const cliente = new Client(nombreCliente, emailCliente, telefonoCliente)
        await ClienteModel.insertOne(cliente);
        console.log(cliente.mostrarCliente());
        console.log("Cliente Agregado Exitosamente✅"); 
        await inquirer.prompt([
            {
              type: 'input',
              name: 'continuar',
              message: chalk.blueBright('\nPresiona Enter para continuar...'),
            }
          ]);
    };


    async listarCliente() {
      const ClienteModel = await clienteModel();
      const pageSize = 3;
      let page = 0;
      let continuar = true;

      while (continuar) {
        const clientes = await ClienteModel.find()
          .skip(page * pageSize)
          .limit(pageSize)
          .toArray();
      
        const totalClientes = await ClienteModel.countDocuments();
      
        if (clientes.length === 0 && page === 0) {
          console.log(chalk.red.bold("\nNo hay clientes registrados.❌​\n"));
          return;
        }
      
        const opciones = clientes.map((cliente, index) => ({
          name: `${(page * pageSize) + index + 1}. ${cliente.nombre}`,
          value: cliente
        }));
      
        if (page > 0) {
          opciones.push(new inquirer.Separator());
          opciones.push({ name: chalk.italic.bgCyan.black('<== Página anterior'), value: 'anterior' });
        }
        if ((page + 1) * pageSize < totalClientes) {
          opciones.push({ name: chalk.italic.bgCyan.black('==> Siguiente página'), value: 'siguiente' });
          opciones.push(new inquirer.Separator());
        }
      
        opciones.push({ name: chalk.bgWhiteBright.black('Búsqueda inteligente🔍'), value: 'busqueda' });
        opciones.push({ name: chalk.redBright.bold('0. Atras'), value: 'salir' });
      
        const { clienteSeleccionado } = await inquirer.prompt([
          {
            type: 'list',
            name: 'clienteSeleccionado',
            message: chalk.yellow('\nSelecciona un cliente para ver más detalles:\n'),
            choices: opciones
          }
        ]);
      
        if (clienteSeleccionado === 'anterior') {
          if (page > 0) page--;
          continue;
        }
        if (clienteSeleccionado === 'siguiente') {
          page++;
          continue;
        }
      
        if (clienteSeleccionado === 'busqueda') {
          const { textoBusqueda } = await inquirer.prompt([
            {
              type: 'input',
              name: 'textoBusqueda',
              message: chalk.cyan('🔍 Ingresa el nombre o parte del nombre del cliente a buscar:'),
            }
          ]);
        
          const resultados = await ClienteModel.find({
            nombre: { $regex: textoBusqueda, $options: 'i' }
          }).toArray();
        
          if (resultados.length === 0) {
            console.log(chalk.red('\n❌ No se encontraron coincidencias.\n'));
            continue;
          }
        
          const opcionesBusqueda = resultados.map((cliente, index) => ({
            name: `${index + 1}. ${cliente.nombre}`,
            value: cliente
          }));
        
          opcionesBusqueda.push({ name: chalk.italic.bgCyan.black('<== Volver'), value: null });
        
          const { clienteEncontrado } = await inquirer.prompt([
            {
              type: 'list',
              name: 'clienteEncontrado',
              message: chalk.yellow('\nResultados encontrados:'),
              choices: opcionesBusqueda
            }
          ]);
        
          if (!clienteEncontrado) continue;
        
          console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
          console.log(`${chalk.bold("Nombre:")} ${clienteEncontrado.nombre}`);
          console.log(`${chalk.bold("Email:")} ${clienteEncontrado.email}`);
          console.log(`${chalk.bold("Teléfono:")} ${clienteEncontrado.telefono}`);
          console.log(`${chalk.bold("ID:")} ${clienteEncontrado._id}`);
        
          await inquirer.prompt([
            {
              type: 'input',
              name: 'continuar',
              message: chalk.blueBright('\nPresiona Enter para continuar...'),
            }
          ]);
          continue;
        }
      
        if (clienteSeleccionado === 'salir') {
          return;
        }
      
        console.log(chalk.green.bold("\nDetalles del Cliente:\n"));
        console.log(`${chalk.bold("Nombre:")} ${clienteSeleccionado.nombre}`);
        console.log(`${chalk.bold("Email:")} ${clienteSeleccionado.email}`);
        console.log(`${chalk.bold("Teléfono:")} ${clienteSeleccionado.telefono}`);
        console.log(`${chalk.bold("ID:")} ${clienteSeleccionado._id}`);
      
        await inquirer.prompt([
          {
            type: 'input',
            name: 'continuar',
            message: chalk.blueBright('\nPresiona Enter para continuar...'),
          }
        ]);
      }
    }

    

    async actualizarCliente(){
      const ClienteModel = await clienteModel();
      const clientes = await ClienteModel.find().toArray();

      if (clientes.length === 0) {
        console.log(chalk.red.bold("\nNo hay clientes registrados.❌​\n"));
        return;
      }

      const opciones = clientes.map((cliente, index) => ({
        name: `${index + 1}. ${cliente.nombre}`,
        value: cliente
      }));

      const { clienteSeleccionado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'clienteSeleccionado',
          message: chalk.yellow('\nSelecciona un cliente para editar:\n'),
          choices: opciones
        }
      ]);

      const { nombreCliente, emailCliente, telefonoCliente } = await datosCliente();
      await ClienteModel.updateOne({_id: clienteSeleccionado._id}, { $set: { nombre: nombreCliente, email: emailCliente, telefono: telefonoCliente } })
      
      console.log("Cliente Actualizado exitosamente✅​");

      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
        }
      ]);
      

    };

    async eliminarCliente(){
      const ClienteModel = await clienteModel();
      const clientes = await ClienteModel.find().toArray();

      if (clientes.length === 0) {
        console.log(chalk.red.bold("\nNo hay clientes registrados.❌​\n"));
        return;
      }

      const opciones = clientes.map((cliente, index) => ({
        name: `${index + 1}. ${cliente.nombre}`,
        value: cliente
      }));

      const { clienteSeleccionado } = await inquirer.prompt([
        {
          type: 'list',
          name: 'clienteSeleccionado',
          message: chalk.yellow('\nSelecciona un cliente para eliminar🔴​\n:'),
          choices: opciones
        }
      ]);

      const { confirmDelete } = await inquirer.prompt([
        {
          type: 'confirm',
          name: 'confirmDelete',
          message: chalk.bgRed('¿Estás seguro de que deseas eliminar este cliente? ⚠️')
        }
      ]);

      if (confirmDelete) {
        await ClienteModel.deleteOne( { _id: clienteSeleccionado._id } )
     
        console.log("Cliente Eliminado exitosamente✅​");
      } else {
        console.log(chalk.yellow("\n Operación cancelada por el usuario.❌\n"));
      }


      await inquirer.prompt([
        {
          type: 'input',
          name: 'continuar',
          message: chalk.blueBright('\nPresiona Enter para regresar al menú...'),
        }
      ]);

    };
      

}



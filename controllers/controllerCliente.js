import inquirer from "inquirer";
import { connection } from "../config/db.js";

export async function crearClie() {
    const session = (await connection()).client.startSession();
    try {
      await session.withTransaction(async () => { //Se ejecuta la sesion dentro de la transaccion
        
        const pizzaModelVar = await pizzaModel();
        const pedidoModelVar = await pedidoModel();
        const repartidorModelVar = await repartidorModel();
        const clienteModelVar = await clienteModel();
  

        const { nombreCliente } = await inquirer.prompt([
          {
            type: 'input',
            name: 'nombreCliente',
            message: 'Ingresa el nombre del Cliente🙎: ',
            validate: input => {
                const regex = /^[a-zA-ZáéíóúÁÉÍÓÚüÜñÑ\s]+$/;
          
                if (!input.trim()) {
                  return 'El nombre no puede estar vacío';
                } else if (!regex.test(input)) {
                  return 'El nombre solo puede contener letras y espacios';
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
                  const regex = /^[a-zA-Z0-9._-]+@[a-zA-Z0-9.-]+\\.[a-zA-Z]{2,20}$/;

                  if (!input.trim()){
                    return 'El email no puede estar vacio';
                  } else if (!regex.test(input)){
                    return 'El email no puede ser erroneo';
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
                const regex = /^[0-9]{16}$/;

                if (!input.trim()){
                  return 'El telefono no puede estar vacio';
                } else if (!regex.test(input)){
                  return 'El telefono debe ser valido';
                }
                return true; 
              }
          }
      ]);
  
        const clientes = await clienteModelVar
          .find({ nombre: { $regex: nombreCliente, $options: 'i' } })
          .toArray();
  
        if (clientes.length === 0) {
          throw new Error('No se encontraron clientes con ese nombre');
        }
  
        console.log('\nCoincidencias de clientes:');
        clientes.forEach((c, index) => {
          console.log(`${index + 1}. ${c.nombre} Teléfono: ${c.telefono}`);
        });
  
        const { selectedCliente } = await inquirer.prompt([
          {
            type: 'list',
            name: 'selectedCliente',
            message: 'Selecciona un cliente:',
            choices: clientes.map(c => ({
              name: `${c.nombre}`,
              value: c._id.toString()
            }))
          }
        ]);
        const clienteId = new ObjectId(selectedCliente);
        console.log(`Cliente seleccionado: ${clientes.find(c => c._id.toString() === selectedCliente).nombre}`);
  
  
  
  
  
        const pizzaIds = [];
        while (true) {
          const { nombrePizza } = await inquirer.prompt([
            {
              type: 'input',
              name: 'nombrePizza',
              message: 'Ingresa el nombre de la pizza (o parte de él):',
              validate: input => input.trim().length > 0 || 'El nombre no puede estar vacío'
            }
          ]);
  
          const pizzas = await pizzaModelVar
            .find({ nombre: { $regex: nombrePizza, $options: 'i' } })
            .toArray();
  
          if (pizzas.length === 0) {
            console.log('No se encontraron pizzas con ese nombre. Intenta de nuevo.');
            continue;
          }
  
          console.log('\nCoincidencias de pizzas:');
          pizzas.forEach((p, index) => {
            console.log(`${index + 1}. ${p.nombre} (Categoría: ${p.categoria}, Precio: $${p.precio})`);
          });
  
          const { selectedPizza } = await inquirer.prompt([
            {
              type: 'list',
              name: 'selectedPizza',
              message: 'Selecciona una pizza:',
              choices: pizzas.map(p => ({
                name: `${p.nombre} (Categoría: ${p.categoria}, Precio: $${p.precio})`,
                value: p._id.toString()
              }))
            }
          ]);
          const pizzaId = new ObjectId(selectedPizza);
          pizzaIds.push(pizzaId);
          console.log(`Pizza seleccionada: ${pizzas.find(p => p._id.toString() === selectedPizza).nombre}`);
  
          const { continuar } = await inquirer.prompt([
            {
              type: 'confirm',
              name: 'continuar',
              message: '¿Deseas agregar otra pizza?',
              default: false
            }
          ]);
  
          if (!continuar) break;
        }
  
        if (pizzaIds.length === 0) {
          throw new Error('No se seleccionaron pizzas para el pedido');
        }
  
  
  
        const pizzas = await pizzaModelVar
          .find({ _id: { $in: pizzaIds.map(id => new ObjectId(id)) } })
          .toArray();
        if (pizzas.length !== pizzaIds.length) {
          throw new Error('Una o más pizzas no existen');
        }
  
        const ingredientesNecesarios = {};
        for (const pizza of pizzas) {
          for (const ing of pizza.ingredientes) {
            ingredientesNecesarios[ing.nombre] = (ingredientesNecesarios[ing.nombre] || 0) + ing.cantidad;
          }
        }
  
        for (const [nombre, cantidad] of Object.entries(ingredientesNecesarios)) {
          const ingrediente = await ingredienteModelVar.findOne({ nombre });
          if (!ingrediente || ingrediente.stock < cantidad) {
            throw new Error(`Ingrediente ${nombre} sin stock suficiente`);
          }
        }
  
        for (const [nombre, cantidad] of Object.entries(ingredientesNecesarios)) {
          await ingredienteModelVar.updateOne(
            { nombre },
            { $inc: { stock: -cantidad } },
            { session }
          );
        }
  
        const total = pizzas.reduce((sum, pizza) => sum + pizza.precio, 0);
  
        const repartidor = await repartidorModelVar.findOneAndUpdate(
          { estado: 'disponible' },
          { $set: { estado: 'ocupado' } },
          { returnDocument: 'after', session }
        );
        if (!repartidor) throw new Error('No hay repartidores disponibles');
  
  
  
  
  
        const pedido = {
          clienteId: new ObjectId(clienteId),
          pizzas: pizzaIds.map(id => new ObjectId(id)),
          total: total,
          fecha: new Date(),
          repartidorAsignado: repartidor._id
        };
        await pedidoModelVar.insertOne(pedido, { session });
  
        console.log('Pedido registrado con éxito:', pedido);
        return pedido;
      });
    } catch (error) {
      console.error('Error en el pedido:', error.message);
      throw error;
    } finally {
      await session.endSession();
    }
  }
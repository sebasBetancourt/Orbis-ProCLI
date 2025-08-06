import { Comando } from "./Comando.js";
import { proyectoModel } from "../../models/Proyectos.js";
import { seleccionarClientePaginado } from "../../utils/seleccionCliente.js";
import chalk from "chalk";
import inquirer from "inquirer";
import { clienteModel } from "../../models/Cliente.js";
import { ObjectId } from "mongodb";
import { entregableModel } from "../../models/Entregables.js";

export class clonarProyectoComando extends Comando{
    async ejecutar(){
    
    try {
        const proyectoCollection = await proyectoModel();
        const entregableCollection = await entregableModel();
        const clienteCollection = await clienteModel();
    
        const proyectos = await proyectoCollection.find().toArray();
    
        if (proyectos.length === 0) {
          console.log(chalk.red('No hay proyectos registrados. ❌'));
          return;
        };
        const { IDproyecto } = await inquirer.prompt([
            {
                type: 'input',
                name: 'IDproyecto',
                message: chalk.cyan('Ingresa el ID del proyecto a Clonar: ')
            }
        ]);
    
        const session = proyectoCollection.client.startSession();
          await session.withTransaction(async () => {
            // Actualizar estado del proyecto
            const proyecto = await proyectoCollection.findOne({ _id: new ObjectId(IDproyecto) }, { session });
            if (!proyecto) {
              throw new Error('Proyecto no encontrado. X');
            }
            
            const clienteSeleccionado = await seleccionarClientePaginado(clienteCollection, 'Selecciona el cliente para clonar el Proyecto:');
            if (!clienteSeleccionado) {
              console.log(chalk.red('No se seleccionó ningún cliente. Cancelando clonacion de proyecto.'));
              return null;
            }
            const IDentregables = [  ]
            const entregables = proyecto.entregables;
            console.log(entregables);
            
            entregables.forEach(entregable => {
                console.log(entregable._id);
                const EntregableID = entregable._id;
                IDentregables.push(EntregableID);
                console.log("Hecho");
                
            });
            
            const EntregablesNuevos = []
            const numeroEntregables = IDentregables.length;
            console.log(numeroEntregables);
            for (let index = 0; index < IDentregables.length; index++) {
                let entregableNuevo = await entregableCollection.findOne({ _id: IDentregables[numeroEntregables - 1] }, { session });
                const nuevo = await entregableCollection.insertOne({ titulo: entregableNuevo.titulo, fechaLimite: new Date(), estado: entregableNuevo.estado });
                const nuevoId = nuevo.insertedId;
                const entregablePush = await entregableCollection.findOne({ _id: nuevoId }, { session });
                entregablePush.push(EntregablesNuevos)
            }
            
            
            
            
            
            const nuevoProyecto = {
                _id: new ObjectId(),
                cienteId: clienteSeleccionado._id,
                propuestaId: proyecto.propuestaId,
                nombre: proyecto.nombre,
                estado: proyecto.estado,
                avances: proyecto.avances,
                contrato: proyecto.contrato,
                entregables: EntregablesNuevos,
                balance: proyecto.balance
            }
            
            await proyectoCollection.insertOne(nuevoProyecto)
              // Actualizar balance del proyecto
            console.log("Hecho");
            await session.endSession();   
    })
    } catch (error) {
        throw new Error("Error Al CLonar"+ error);
        
    }
    
    }
}
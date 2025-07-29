
import {MongoClient} from 'mongodb';


const uri = "mongodb://localhost:27017/";
const nombreDB = "portafolio-freelancer";
const cliente = new MongoClient(uri);


export async function connection() {
    await cliente.connect();
    console.log("Se ha establecido la conexion MongoDB✅"); 
    return cliente.db(nombreDB);
}

export async function closeConection() {
    if (cliente){
        await cliente.close()
        console.log("Se ha cerrado la conexion MongoDB❌");
    }
    
}
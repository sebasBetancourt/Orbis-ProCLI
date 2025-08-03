import { MongoClient } from 'mongodb';
import dotenv from 'dotenv';

dotenv.config();

const uri = 'mongodb+srv://sebas:hola123@sebas.appw5ak.mongodb.net/'; 
const nombreDB = 'ORBISDB';

const cliente = new MongoClient(uri);

export async function connection() {
    try {
        await cliente.connect();
        console.log("Se ha establecido la conexión con MongoDB✅\n");
        return cliente.db(nombreDB);
    } catch (error) {
        throw new Error("Error: ", error);
    }
}

export async function closeConnection() {
    if (cliente) {
        try {
            await cliente.close();
            console.log("Se ha cerrado la conexión con MongoDB❌");
        } catch (error) {
            throw new Error("Error: ", error);
        }
    }
}
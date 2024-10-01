import mongoose from "mongoose";
import dotenv from "dotenv"

dotenv.config()

function _connect() {
  const URI = "mongodb+srv://"+ process.env.MONGO_INITDB_ROOT_USERNAME + ":" + process.env.MONGO_INITDB_ROOT_PASSWORD + "@" + process.env.MONGO_HOST + "/?retryWrites=true&w=majority&appName=" + process.env.MONGO_DB;

  console.log(URI);
    mongoose.connect(URI)
    .then(() => {
        console.log("Conectado a la Base de Datos.");
    })
    .catch((error) =>
        console.error("Error: No se pudo conectar con la base de datos", error)
    );
}

export default _connect;

const express = require("express");
const app = express();


// Routes
app.use(require("./routes/index.routes"));

// Servir archivos estáticos
//app.use(express.static(path.join(__dirname, "../public")));

// Iniciar el servidor
app.listen(4000, '0.0.0.0',() => {
    console.log("El servidor está escuchando por el puerto 4000");
});
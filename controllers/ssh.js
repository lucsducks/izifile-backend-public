const sshModel = require('../models/ssh');

// Map para almacenar múltiples conexiones
const connections = new Map();

// Límite de conexiones simultáneas
const MAX_CONNECTIONS = 10;

const generarId = (host, username) => `${host}-${username}`;

const conectar = async (req, res) => {
  try {
    // Recuperar host y username desde los parámetros de ruta
    const host = req.params.host;
    const username = req.params.username;

    // Configuración para la conexión SSH
    const config = {
      host: host,
      port: req.body.port || 22,
      username: username,
      password: req.body.password
    };

    // Generar un identificador único para la conexión
    const id = generarId(host, username);

    // Verificar si ya existe una conexión con ese identificador
    if (connections.has(id)) {
      res.status(400).json({
        message: "Ya existe una conexión con este identificador."
      });
      return;
    }

    const conexion = await sshModel.connectToServer(config);
    const shellStream = await sshModel.startShell(conexion);

    const prompt = await sshModel.getPrompt(shellStream);
    console.log("esto es el prompt" + prompt);
    // Almacenar el shellStream y el prompt en el mapa
    connections.set(id, { shell: shellStream, prompt: prompt });

    // Ahora, cuando ejecutes un comando, puedes usar el prompt almacenado
    
    // Enviar respuesta al cliente
    res.status(201).json({
      message: "Conexión establecida exitosamente",
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al conectarse",
      error: error.message,
    });
  }
};



const execute = async (req, res) => {
  try {
    const id = generarId(req.body.host, req.body.username);
    const connectionData = connections.get(id);

    if (!connectionData || !connectionData.shell) {
      res.status(400).send('Conexión no establecida. Conéctate primero.');
      return;
    }

    const shellStream = connectionData.shell;
    const prompt = connectionData.prompt;

    const command = req.body.command;
    const result = await sshModel.executeCommandInShell(shellStream, command, prompt);
    const outputLimpio = limpiarSecuenciasEscape(result);
    const dataProcesada = procesarSalida(outputLimpio);
    res.json(dataProcesada);

  } catch (error) {
    res.status(500).send('Error al ejecutar el comando: ' + error.message);
  }
};


const deconectar = async (req, res) => {
  try {
    const id = generarId(req.body.host, req.body.username);
    const shellStream = connections.get(id);

    if (shellStream) {
      shellStream.end();
      connections.delete(id);
    }

    res.status(200).json({
      message: "Conexión cerrada exitosamente"
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al cerrar la conexión",
      error: error.message
    });
  }
};

function limpiarSecuenciasEscape(str) {
  return str.replace(/\x1B[[(?);]{0,2}(;?\d)*./g, '');
}

function procesarSalida(output) {
  const promptPattern = /[@:][~]?[#$>]\s*$/;
  const promptIndex = output.search(promptPattern);
  const commandOutput = (promptIndex !== -1) ? output.slice(0, promptIndex) : output;

  return {
    commandOutput: commandOutput.trim()
  };
}

// Limpieza de conexiones inactivas
setInterval(() => {
  for (let [id, shellStream] of connections) {
    if (!shellStream) {
      connections.delete(id);
    }
    // Aquí puedes agregar más lógica para determinar si una conexión es inactiva.
  }
}, 60000); // Ejecuta cada minuto
const listarConexiones = (req, res) => {
  try {
    // Crear un array con los identificadores de todas las conexiones activas
    const conexionesActivas = Array.from(connections.keys());

    // Enviar respuesta al cliente con la lista de conexiones activas
    res.status(200).json({
      message: "Conexiones activas:",
      conexiones: conexionesActivas
    });
  } catch (error) {
    res.status(500).json({
      message: "Error al listar las conexiones",
      error: error.message
    });
  }
};

module.exports = {
  conectar,
  execute,
  deconectar,
  listarConexiones
};

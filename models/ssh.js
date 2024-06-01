const { Client } = require('ssh2');

const connectToServer = (config) => {
  return new Promise((resolve, reject) => {
    const conn = new Client();
    conn.on('ready', () => {
      resolve(conn);
    }).on('error', (err) => {
      reject(err);
    }).connect(config);
  });
};

const startShell = (connection) => {
  return new Promise((resolve, reject) => {
    connection.shell((err, stream) => {
      if (err) reject(err);
      resolve(stream);
    });
  });
};

const getPrompt = (shellStream) => {
  return new Promise((resolve) => {
    let data = '';
    shellStream.on('data', (chunk) => {
      data += chunk;
      // Buscamos un patrón común de prompt. Puede que necesites ajustarlo.
      const promptPattern = /[@:][~]?[#$>]\s*$/;
      if (promptPattern.test(data)) {
        const matches = data.match(promptPattern);
        if (matches && matches[0]) {
          resolve(matches[0]);
        }
      }
    });
    // Enviamos un comando vacío para activar el prompt
    shellStream.write('\n');
  });
};


const executeCommandInShell = (shellStream, command, prompt) => {
  return new Promise((resolve, reject) => {
    let data = '';
    shellStream.on('data', (chunk) => {
      data += chunk;
      if (data.includes(prompt)) {
        const output = data.replace(command, '').replace(prompt, '').trim();
        resolve(output);
      }
    });
    shellStream.write(command + '\n');

    // Temporizador para rechazar la promesa si no se ha resuelto después de 10 segundos
    setTimeout(() => {
      reject(new Error('Command execution timed out'));
    }, 10000); // Puedes ajustar este valor según tus necesidades
  });
};



module.exports = {
  connectToServer,
  startShell,
  executeCommandInShell,
  getPrompt
};

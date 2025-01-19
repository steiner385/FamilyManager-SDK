import { createServer } from 'net';

function checkPort(port) {
  return new Promise((resolve) => {
    const server = createServer();
    
    server.once('error', (err) => {
      if (err.code === 'EADDRINUSE') {
        resolve(false);
      }
    });
    
    server.once('listening', () => {
      server.close();
      resolve(true);
    });
    
    server.listen(port);
  });
}

async function checkPorts() {
  const portsToCheck = [6010, 6012, 6013, 6014];
  const results = await Promise.all(
    portsToCheck.map(async (port) => {
      const isAvailable = await checkPort(port);
      if (!isAvailable) {
        console.error(`Port ${port} is already in use`);
      }
      return isAvailable;
    })
  );
  
  if (results.some((available) => !available)) {
    console.error('Some required ports are in use. Please free them before running tests.');
    process.exit(1);
  }
}

checkPorts();

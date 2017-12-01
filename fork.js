const cluster = require('cluster');
const numCpus = require('os').cpus().length;

if (cluster.isMaster) {
    let numWorkers = 0;
    while (numWorkers < numCpus) {
        cluster.fork({ workerId: numWorkers });
        numWorkers++;
    }

    for(const id in cluster.workers) {
        cluster.workers[id].on('message', (msg) => {
            console.log(msg);
        });

        cluster.on('exit', () => {
            numWorkers--;
            if (numWorkers === 0) {
                cluster.disconnect();
            }
        });
    }
} else {
    process.send(process.env.workerId);
    process.disconnect();
}
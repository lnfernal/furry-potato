const config = require("./config.js");
const net = require("net");
const { decodePacket } = require("./packet-parser.js");

const server = net.createServer((c) => {
    console.log("Client Connected.");
    let pc = net.createConnection({ host: config.host, port: config.port }, () => {
        console.log("ProxyClient Connected.");
        pc.on("data", (data) => {
            c.write(data);
            process.stdout.write("\u001b[31;1m");
            console.log(data);
        });
        pc.on("end", () => {
            console.log("ProxyClient Disconnected.");
        });
    });
    c.on("data", (data) => {
        pc.write(data);
        decodePacket(data);
        process.stdout.write("\u001b[32;1m");
        console.log(data);
    });
    c.on("end", () => {
        console.log("Client Disconnected.");
        pc.end();
    });
});

server.listen(7777);
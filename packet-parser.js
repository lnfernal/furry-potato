const { PacketTypes, NetModules } = require("./packets.js");

function decodePacket (packet)
{
    const buffer = Buffer.from(packet, "hex");

    var data = {};
    var cursor = 0;

    // reading functions
    function getByte () { cursor++; return buffer.readUInt8(cursor - 1); };
    function getBytes (amount = -1)
    {
        var bytes = [];
        for (var i = cursor; i < (amount < 0 ? buffer.length : cursor + amount); i++) bytes.push(buffer[i]);
        cursor = i;
        return bytes;
    };
    function getString (amount = -1) { return String.fromCharCode.apply(null, getBytes(amount)); }
    function getInt16 () { cursor += 2; return buffer.readint16(cursor - 2); };
    function getUInt16 () { cursor += 2; return buffer.readUInt16LE(cursor - 2); }; // little-endian: reads number right to left

    // start reading
    const packetLength = getUInt16();
    data.type = PacketTypes[getByte()];

    switch (data.type)
    {
        case "LoadNetModule":
            const id = getUInt16();
            switch (NetModules[id])
            {
                case "Text":
                    cursor++; // idk what this byte means
                    data.color = [getByte(), getByte(), getByte()]; // color???
                    cursor++; // don't know what this is either
                    data.text = getString();
                    break;
            }
            break;
    }

    process.stdout.write("\x1b[0m");
    console.log(data);
}

module.exports = { decodePacket };
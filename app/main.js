import { open } from "fs/promises";

const COMMANDS = [".dbinfo", ".tables"];

const databaseFilePath = process.argv[2];
const command = process.argv[3];

if (COMMANDS.includes(command)) {
  const databaseFileHandler = await open(databaseFilePath, "r");

  const { buffer: headerBuffer } = await databaseFileHandler.read({
    length: 108,
    position: 0,
    buffer: Buffer.alloc(108),
  });

  const pageSize = headerBuffer.readUInt16BE(16); // page size is 2 bytes starting at offset 16

  const { buffer: btreePageBuffer } = await databaseFileHandler.read({
    length: pageSize,
    position: 100,
    buffer: Buffer.alloc(pageSize),
  });

  const regex = /CREATE TABLE (?!sqlite_)(\w+)/g;
  const tables = (btreePageBuffer.toString().match(regex) || []).map((t) =>
    t.replace("CREATE TABLE", "").trim()
  );

  if (command === ".dbinfo") {
    console.log(`database page size: ${pageSize}`);
    console.log(`number of tables: ${tables.length}`);
  }
  if (command === ".tables") {
    console.log(...tables.reverse());
  }
} else {
  throw `Unknown command ${command}`;
}

import { open } from "fs/promises";

const databaseFilePath = process.argv[2];
const command = process.argv[3];

if (command === ".dbinfo") {
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

  const cellOffset = btreePageBuffer.readUInt16BE(5); // b-tree header, offset 5, 2 bytes
  const cellLength = pageSize - cellOffset;

  const { buffer: cellBuffer } = await databaseFileHandler.read({
    length: cellLength,
    position: cellOffset,
    buffer: Buffer.alloc(cellLength),
  });

  const cellData = cellBuffer.toString();

  const regex = /CREATE TABLE(?! sqlite_sequence)/g;
  const numberOfTables = (cellData.match(regex) || []).length;

  console.log(`database page size: ${pageSize}`);
  console.log(`number of tables: ${numberOfTables}`);
} else {
  throw `Unknown command ${command}`;
}

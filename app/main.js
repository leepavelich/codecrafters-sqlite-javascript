import { open } from "fs/promises";

const COMMANDS = [".dbinfo", ".tables"];

async function readDatabaseInfo(databaseFilePath) {
  const databaseFileHandler = await open(databaseFilePath, "r");

  const dbHeaderLength = 100; // bytes

  const { buffer: headerBuffer } = await databaseFileHandler.read({
    length: dbHeaderLength,
    position: 0,
    buffer: Buffer.alloc(dbHeaderLength),
  });

  const pageSize = headerBuffer.readUInt16BE(16);

  const { buffer: btreePageBuffer } = await databaseFileHandler.read({
    length: pageSize,
    position: dbHeaderLength,
    buffer: Buffer.alloc(pageSize),
  });

  const regex = /CREATE TABLE (?!sqlite_)(\w+)/g;
  const tables = (btreePageBuffer.toString().match(regex) || []).map((t) =>
    t.replace("CREATE TABLE", "").trim()
  );

  await databaseFileHandler.close();

  return { pageSize, tables };
}

async function executeCommand(databaseFilePath, command) {
  if (COMMANDS.includes(command)) {
    const { pageSize, tables } = await readDatabaseInfo(databaseFilePath);

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
}

const databaseFilePath = process.argv[2];
const command = process.argv[3];

executeCommand(databaseFilePath, command).catch((error) => {
  console.error(error);
});

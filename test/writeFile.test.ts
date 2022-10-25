import { WriteStreamPartitionFile } from '../src/index';

describe('test write', () => {
  it('txt file', async () => {
    const outDirPath = process.cwd() + '/tmp';
    const fileName = 'test';
    const fileExt = 'txt';
    const countPerFile = 5;
    const partitionFileWriter = new WriteStreamPartitionFile(
      outDirPath,
      fileName,
      fileExt,
      countPerFile
    );
    for (let i = 0; i <= 20; i++) {
      await partitionFileWriter.write('hello\n');
    }
    await partitionFileWriter.end();
    expect(partitionFileWriter.getWriteCount()).toEqual(21);
    expect(partitionFileWriter.getFileCount()).toEqual(5);
  });

  it('json file', async () => {
    const outDirPath = process.cwd() + '/tmp/json-data';
    const fileName = 'test';
    const fileExt = 'json';
    const countPerFile = 5;
    const partitionFileWriter = new WriteStreamPartitionFile(
      outDirPath,
      fileName,
      fileExt,
      countPerFile,
      {
        start: '[\n',
        end: ']',
      }
    );

    for (let i = 0; i <= 20; i++) {
      const data = JSON.stringify({ hello: 'world', foo: 'bar' }, null, 4);

      await partitionFileWriter.write(data + ',' + '\n');
    }
    await partitionFileWriter.end();
    expect(partitionFileWriter.getWriteCount()).toEqual(21);
    expect(partitionFileWriter.getFileCount()).toEqual(5);
  });
});

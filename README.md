## Write stream partition file

### Install

```sh
$ npm i write-stream-partition-file
```

### Usage

```ts
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
```

- The result of working directory like:

```
├── tmp
    ├── test-0.txt
    ├── test-1.txt
    ├── test-2.txt
    ├── test-3.txt
    └── test-4.txt
```

```sh
$ cat tmp/test-0.txt
```

```
hello
hello
hello
hello
hello
```

## Options

- In some case, need to start or end each file with some characters like `json` format.

```ts
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
```

The tree of working directory:

```sh
tmp
├── json-data
│   ├── test-0.json
│   ├── test-1.json
│   ├── test-2.json
│   ├── test-3.json
│   └── test-4.json
├── test-0.txt
├── test-1.txt
├── test-2.txt
├── test-3.txt
└── test-4.txt
```

```sh
$ cat tmp/json-data/test-0.json
```

- The result json file like:

```
[
{
  "hello": "world",
  "foo": "bar"
},
{
  "hello": "world",
  "foo": "bar"
},
{
  "hello": "world",
  "foo": "bar"
},
{
  "hello": "world",
  "foo": "bar"
},
{
  "hello": "world",
  "foo": "bar"
},
]
```

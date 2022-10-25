import { createWriteStream, existsSync, mkdirSync, WriteStream } from 'fs';
export class WriteStreamPartitionFile {
  private outDir: string;
  private fileName: string;
  private fileExt: string;
  private writer?: WriteStream;
  private maxRow: number;
  private rowCounter: number = 0;
  private fileCounter: number = 0;
  private totalCounter: number = 0;
  private options: { start?: string; end?: string } = { start: '', end: '' };
  constructor(
    outDir: string,
    fileName: string,
    fileExt: string,
    limitCountPerFile: number,
    options?: { start?: string; end?: string }
  ) {
    this.outDir = outDir;
    this.fileName = fileName;
    this.fileExt = fileExt;
    this.maxRow = limitCountPerFile;
    if (options) {
      this.options = options;
    }
  }
  async write(content: string) {
    if (!this.writer) {
      await this.makeWriter();
    }
    if (this.rowCounter == 0) {
      await this.writeStart();
    }
    await this.writeAsync(content);
    ++this.rowCounter;
    ++this.totalCounter;
    if (this.rowCounter == this.maxRow) {
      this.rowCounter = 0;
      await this.writeEnd();
      await this.makeWriter();
    }
  }
  async end() {
    await this.writeEnd();
  }

  getWriteCount() {
    return this.totalCounter;
  }

  getFileCount() {
    return this.fileCounter;
  }

  private async writeStart() {
    if (!this.options.start) {
      return;
    }
    await this.writeAsync(this.options.start);
  }
  private async writeEnd() {
    if (!this.options.end) {
      return;
    }
    await this.writeAsync(this.options.end);
  }

  private async writeAsync(content: string): Promise<void> {
    return new Promise(resolve => {
      (this.writer as WriteStream).write(content, () => {
        resolve();
      });
    });
  }
  private async makeWriter() {
    if (this.writer && !this.writer.closed) {
      await this.closeWriter();
    }
    if (!existsSync(this.outDir)) {
      mkdirSync(this.outDir, { recursive: true });
    }
    this.writer = createWriteStream(
      `${this.outDir}/${this.fileName}-${this.fileCounter++}.${this.fileExt}`,
      { encoding: 'utf-8' }
    );
  }

  private closeWriter(): Promise<void> {
    return new Promise((resolve, reject) => {
      (this.writer as WriteStream).close(err => {
        if (err) {
          reject(err);
        }
        resolve();
      });
    });
  }
}

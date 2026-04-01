import { SDK, PinnedObject, UploadOptions, DownloadOptions, Reader, Writer } from "./sia_storage_ffi.js";

/**
 * Adapts a Buffer or Uint8Array to the Reader trait.
 */
export declare class BufferReader implements Reader {
  constructor(buffer: Buffer | Uint8Array, chunkSize?: number);
  read(): Promise<Uint8Array>;
}

/**
 * Collects written data into a Buffer.
 */
export declare class BufferWriter implements Writer {
  constructor();
  write(data: Uint8Array): Promise<void>;
  toBuffer(): Buffer;
  toUint8Array(): Uint8Array;
}

/**
 * Upload bytes directly to the Sia network.
 */
export declare function uploadBytes(
  sdk: SDK,
  data: Buffer | Uint8Array,
  options?: UploadOptions,
): Promise<PinnedObject>;

/**
 * Download an object and return its contents as a Buffer.
 */
export declare function downloadBytes(
  sdk: SDK,
  obj: PinnedObject,
  options?: DownloadOptions,
): Promise<Buffer>;

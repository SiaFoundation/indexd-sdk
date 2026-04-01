/**
 * Idiomatic Node.js wrappers for the Sia SDK.
 *
 * This module provides convenience classes and functions that make the SDK
 * feel native to Node.js developers, wrapping the low-level Reader/Writer
 * traits with standard Buffer/stream support.
 */

// Note: SDK, PinnedObject, UploadOptions, DownloadOptions are used in
// JSDoc/types only. Records (UploadOptions, DownloadOptions) are plain
// objects at runtime and not exported from the generated module.

/**
 * Adapts a Buffer or Uint8Array to the Reader trait.
 *
 * This allows you to upload data from any in-memory buffer.
 *
 * @example
 * const reader = new BufferReader(Buffer.from("hello, world!"));
 * const obj = await sdk.upload(reader);
 */
export class BufferReader {
  #buffer;
  #offset;
  #chunkSize;

  /**
   * @param {Buffer|Uint8Array} buffer - The data to read from.
   * @param {number} [chunkSize=65536] - Size of chunks to read (default 64KiB).
   */
  constructor(buffer, chunkSize = 65536) {
    this.#buffer = buffer;
    this.#offset = 0;
    this.#chunkSize = chunkSize;
  }

  /** Read the next chunk of data. */
  async read() {
    if (this.#offset >= this.#buffer.length) {
      return new Uint8Array(0);
    }
    const end = Math.min(this.#offset + this.#chunkSize, this.#buffer.length);
    const chunk = this.#buffer.subarray(this.#offset, end);
    this.#offset = end;
    return chunk;
  }
}

/**
 * Adapts a writable destination to the Writer trait, collecting into a Buffer.
 *
 * @example
 * const writer = new BufferWriter();
 * await sdk.download(writer, obj);
 * const data = writer.toBuffer();
 */
export class BufferWriter {
  #chunks;

  constructor() {
    this.#chunks = [];
  }

  /** Write a chunk of data. */
  async write(data) {
    if (data.length > 0) {
      this.#chunks.push(data.slice());
    }
  }

  /** Get the collected data as a Buffer. */
  toBuffer() {
    return Buffer.concat(this.#chunks);
  }

  /** Get the collected data as a Uint8Array. */
  toUint8Array() {
    const buf = this.toBuffer();
    return new Uint8Array(buf.buffer, buf.byteOffset, buf.byteLength);
  }
}

/**
 * Upload bytes directly to the Sia network.
 *
 * @param {SDK} sdk - The SDK instance.
 * @param {Buffer|Uint8Array} data - The bytes to upload.
 * @param {UploadOptions} [options] - Optional upload options.
 * @returns {Promise<PinnedObject>} The pinned object representing the uploaded data.
 *
 * @example
 * const obj = await uploadBytes(sdk, Buffer.from("hello, world!"));
 */
export async function uploadBytes(sdk, data, options) {
  return await sdk.upload(
    new BufferReader(data),
    options ?? { max_inflight: 10, data_shards: 10, parity_shards: 20, progress_callback: undefined },
  );
}

/**
 * Download an object and return its contents as a Buffer.
 *
 * @param {SDK} sdk - The SDK instance.
 * @param {PinnedObject} obj - The pinned object to download.
 * @param {DownloadOptions} [options] - Optional download options.
 * @returns {Promise<Buffer>} The downloaded data.
 *
 * @example
 * const data = await downloadBytes(sdk, obj);
 * console.log(data.toString());
 */
export async function downloadBytes(sdk, obj, options) {
  const writer = new BufferWriter();
  await sdk.download(
    writer,
    obj,
    options ?? { max_inflight: 10, offset: 0n, length: undefined },
  );
  return writer.toBuffer();
}

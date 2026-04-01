# SiaStorageSDK for Node.js

Node.js bindings for Sia Storage, built with Rust and UniFFI.

## Requirements

- Node.js 20+
- ESM modules (`"type": "module"` in package.json)

## Installation

```bash
npm install sia-storage-sdk
```

## Example

```javascript
import {
  generate_recovery_phrase,
  set_logger,
  Builder,
  BufferReader,
  BufferWriter,
  uploadBytes,
  downloadBytes,
} from "sia-storage-sdk";

// Set up logging
set_logger({
  debug(msg) { console.log("DEBUG", msg); },
  info(msg) { console.log("INFO", msg); },
  warn(msg) { console.log("WARNING", msg); },
  error(msg) { console.log("ERROR", msg); },
}, "debug");

// Create a builder and connect
const builder = new Builder("https://app.sia.storage", {
  id: new Uint8Array(32).fill(0x01),
  name: "My App",
  description: "App description",
  service_url: "https://myapp.com",
  logo_url: undefined,
  callback_url: undefined,
});
await builder.request_connection();

// Wait for user approval
await builder.wait_for_approval();

// Register with a recovery phrase
const mnemonic = generate_recovery_phrase();
const sdk = await builder.register(mnemonic);

// Upload data
const upload = await sdk.upload_packed({
  max_inflight: 10,
  data_shards: 10,
  parity_shards: 20,
  progress_callback: undefined,
});
const reader = new BufferReader(Buffer.from("hello, world!"));
await upload.add(reader);
const objects = await upload.finalize();

// Download data
const writer = new BufferWriter();
await sdk.download(writer, objects[0], {
  max_inflight: 10,
  offset: 0n,
  length: undefined,
});

// Or use convenience functions
const obj = await uploadBytes(sdk, Buffer.from("hello!"));
const data = await downloadBytes(sdk, obj);
```

`BufferReader` and `BufferWriter` are provided by the SDK. For custom streaming,
implement the `Reader` and `Writer` interfaces directly.

A complete working example is available in [examples/node/](../examples/node/).

## Local Development

```sh
# Install uniffi-bindgen-node-js (first time only)
cargo install --git https://github.com/SiaFoundation/uniffi-bindgen-node-js

# Build native library, generate bindings, and assemble the package
./node/build.sh

# Run the example
cd examples/node && npm install && node example.mjs
```

## License

MIT License - see [LICENSE](../LICENSE) for details.

# sia-indexd

Kotlin SDK for interacting with a Sia network indexer.

## Installation

Add the dependency to your `build.gradle.kts`:

```kotlin
dependencies {
    implementation("tech.sia:sia-indexd:0.3.0")
}
```

### Building from source

To build from source, you need Rust, JDK 17+, and Gradle:

```bash
# Build the native library
cargo build --release

# Generate Kotlin bindings
cargo run --bin uniffi-bindgen generate \
    --library target/release/libindexd_ffi.so \
    --language kotlin \
    --out-dir kotlin/src/main/kotlin \
    --config kotlin/uniffi.toml

# Copy the native library to the appropriate JNA resource directory
# Linux x86_64:
mkdir -p kotlin/src/main/resources/linux-x86-64
cp target/release/libindexd_ffi.so kotlin/src/main/resources/linux-x86-64/

# macOS ARM64:
# mkdir -p kotlin/src/main/resources/darwin-aarch64
# cp target/release/libindexd_ffi.dylib kotlin/src/main/resources/darwin-aarch64/

# Build the JAR
cd kotlin
gradle build
```

## Usage

See `Example.kt` for a full working example. To run it, add the SDK JAR to your project's dependencies and compile/run the example with Kotlin.

## Coroutine Support

This SDK uses Kotlin coroutines (`suspend` functions) for all async network operations. Use `runBlocking` or launch a coroutine scope to call async SDK methods.

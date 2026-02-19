// swift-tools-version: 6.0
import Foundation
import PackageDescription

// Set INDEXD_SDK_USE_LOCAL_XCFRAMEWORK=1 to use a locally-built XCFramework.
let useLocalBinary = ProcessInfo.processInfo.environment["INDEXD_SDK_USE_LOCAL_XCFRAMEWORK"] == "1"

let binaryTarget: Target = useLocalBinary
    ? .binaryTarget(
        name: "IndexdSDKFFI",
        path: "build/IndexdSDKFFI.xcframework"
    )
    : .binaryTarget(
        name: "IndexdSDKFFI",
        url: "https://github.com/SiaFoundation/indexd-sdk/releases/download/v0.1.0/IndexdSDKFFI-0.1.0.xcframework.zip",
        checksum: "e60caf6daee776714b36866a359adbe8bf9386ac349dd96d429a699c51705b34"
    )

let package = Package(
    name: "IndexdSDK",
    platforms: [
        .iOS(.v16),
        .macOS(.v14)
    ],
    products: [
        .library(name: "IndexdSDK", targets: ["IndexdSDK"])
    ],
    targets: [
        binaryTarget,
        .target(
            name: "IndexdSDK",
            dependencies: ["IndexdSDKFFI"],
            path: "swift/Sources/IndexdSDK",
            swiftSettings: [
                .swiftLanguageMode(.v5)
            ],
            linkerSettings: [
                .linkedFramework("Security"),
                .linkedFramework("SystemConfiguration")
            ]
        )
    ]
)

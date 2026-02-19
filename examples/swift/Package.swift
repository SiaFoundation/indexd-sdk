// swift-tools-version: 6.0
import PackageDescription

let package = Package(
    name: "Example",
    platforms: [
        .iOS(.v16),
        .macOS(.v14)
    ],
    dependencies: [
        // Reference the IndexdSDK package at the repo root
        .package(path: "../../"),
    ],
    targets: [
        .executableTarget(
            name: "Example",
            dependencies: [
                .product(name: "IndexdSDK", package: "indexd-sdk"),
            ],
            path: "Sources"
        )
    ]
)

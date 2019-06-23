const path = require("path");
const CopyWebpackPlugin = require("copy-webpack-plugin");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");
const Version = require("./version.json");

const Major = process.env.DEV_MAJOR || Version.Major;
const Minor = process.env.DEV_MINOR || Version.Minor;
const Patch = process.env.DEV_PATCH || Version.Patch;

const Config = {};

Config["release"] = {
    Tag: "",
    TaskGuid: "{{guid_release}}",
};

Config["debug"] = {
    Tag: "Debug",
    TaskGuid: "{{guid_debug}}",
};

function GetFlavor(env) {
    if (env.toLowerCase().includes("release")) return "release";
    return "debug";
}

module.exports = env => {

    const flavor = GetFlavor(env);
    console.log(`Flavor: ${flavor}`);
    console.log(`Version: ${Major}.${Minor}.${Patch}`);

    const config = {
        target: "node",
        entry: !env.includes("test-suite") ? {
            "custom-task/main": "./src/custom-task/main.ts",
        } : {
            "tests/main": "./tests/main.ts"
        },
        output: {
            filename: "[name].js",
            path: path.resolve(__dirname, "./dist")
        },
        optimization: {
            minimize: false,
        },
        mode: flavor === "debug" ? "development" : "production",
        resolve: {
            modules: ["node_modules"],
            extensions: [".ts", ".js"]
        },
        module: {
            rules: [
                {
                    test: /\.ts?$/,
                    exclude: /node_modules/,
                    enforce: "pre",
                    use: [
                        {
                            loader: "ts-loader",
                            options: {
                                configFile: "tsconfig.json"
                            }
                        }
                    ]
                }
            ]
        },
        devtool: "inline-source-map",
        plugins: [
            new CopyWebpackPlugin([
                // These files are needed by azure-pipelines-task-lib library.
                {
                    from: path.join(__dirname, "./node_modules/azure-pipelines-task-lib/lib.json"),
                    to: path.join(__dirname, "./dist/custom-task")
                },
                {
                    from: path.join(__dirname, "./node_modules/azure-pipelines-task-lib/Strings"),
                    to: path.join(__dirname, "./dist/custom-task/Strings")
                },

                // Files needed for extension
                {
                    from: path.join(__dirname, "./src/custom-task/task.json"),
                    to: path.join(__dirname, "./dist/custom-task")
                },
                {
                    from: path.join(__dirname, "./images/gear.png"),
                    to: path.join(__dirname, "./dist/custom-task/icon.png")
                },
                {
                    from: path.join(__dirname, "./src/manifest.json"),
                    to: path.join(__dirname, "./dist/manifest.json")
                },
                {
                    from: path.join(__dirname, "./images/gear.png"),
                    to: path.join(__dirname, "./dist/icon.png")
                },
                {
                    from: path.join(__dirname, "./src/README.md"),
                    to: path.join(__dirname, "./dist")
                },
            ]),

            new ReplaceInFileWebpackPlugin([

                // This replacement is required to allow azure-pipelines-task-lib to load the 
                // json resource file correctly
                {
                    dir: "dist/custom-task",
                    files: [ "main.js" ],
                    rules: [
                        {
                            search: /__webpack_require__\(.*\)\(resourceFile\)/,
                            replace: 'require(resourceFile)'
                        }
                    ]
                },

                // Perform global string replacements
                {
                    dir: "dist",
                    files: env.includes("test-suite") ? [
                        "tests/main.js"
                    ] : [
                        "custom-task/main.js",
                        "custom-task/task.json",
                        "manifest.json"
                    ],
                    rules: [
                        // This replacement is required to bypass the loading for package.json
                        // by azure-devops-node-api library for reading library version. This 
                        // directly injects the version as text.
                        {
                            search: /JSON\.parse.{0,50}package\.json.{0,20}version/,
                            replace: '"7.2.0"' // This should match the entry in package.json
                        },
                        {
                            search: /{{version}}/ig,
                            replace: `${Major}.${Minor}.${Patch}`
                        },
                        {
                            search: /\"?{{major}}\"?/ig,
                            replace: `${Major}`
                        },
                        {
                            search: /\"?{{minor}}\"?/ig,
                            replace: `${Minor}`
                        },
                        {
                            search: /\"?{{patch}}\"?/ig,
                            replace: `${Patch}`
                        },
                        {
                            search: /{{flavor}}/ig,
                            replace: `${flavor}`
                        },
                        {
                            search: /{{taskid}}/ig,
                            replace: Config[flavor].TaskGuid
                        },
                        {
                            search: /{{tag}}/ig,
                            replace: Config[flavor].Tag
                        }
                    ]
                }
            ]),
        ],

        stats: env.toLowerCase().includes("verbose") ? "normal" : "errors-only",

        // I don't know why this works, but it does. This is necessary to ensure that
        // __dirname does not get resolved to just '/' and result in modules not being
        // able to locate resource files.
        node: {
            __dirname: false,
            __filename: false
        }
    };

    return config;
};

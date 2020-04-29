const path = require("path");
const ReplaceInFileWebpackPlugin = require("replace-in-file-webpack-plugin");

// This files contains common webpack code that can be potentially
// reused by other contributions

// All build files for a component are generated inside
// a dedicated folder within the distribution folder
const GetTargetPath = () => {
    return path.resolve("./dist");
}

// Following webpack settings are common to all components
// that are targeted to run in Node environments
const FillDefaultNodeSettings = (c, env, component) => {

    c.target = "node";

    // Do not minimize files by default because non-minimized
    // files are easier to read and hence easier to debug
    c.optimization = { minimize: false };

    // Webpack overrides "__dirname" to "/" by default. We need the behavior
    // to be similar to Node's behavior where it refers to the current working directory
    c.node = { __dirname: false };

    c.module = { rules: [ TsLoaderRule ] };

    c.output = {
        filename: "[name].js",
        path: path.join(GetTargetPath(), component)
    }

    c.mode = "production";

    c.resolve = {
        modules: ["node_modules"],
        extensions: [".ts", ".js"],
    };

    c.devtool = "inline-source-map";

    console.log(`Component: ${component}`);
    console.log(`Env: ${env}`);
    return c;
};

// This replacement is required to bypass the loading for package.json
// by azure-devops-node-api library for reading library version. This 
// directly injects the version as text.
const PackageJsonLoadFixer = (dir, files) => {
    return new ReplaceInFileWebpackPlugin([
        {
            dir,
            files,
            rules: [
                {
                    search: /JSON\.parse.{0,50}package\.json.{0,20}version/,
                    replace: '"7.2.0"'
                }
            ]
        }
    ]);
};

// This helps in obtaining a timestamp based version string for local development.
const VersionStringReplacer = (dir, files) => {
    const now = new Date();
    const major = `1`;
    const minor = `${Pad(now.getFullYear(), 4)}${Pad(now.getMonth(), 2)}${Pad(now.getDate(), 2)}`;
    const patch = `${Pad(now.getSeconds() + (60 * (now.getMinutes() + (60 * now.getHours()))), 5)}`;
    const version =`${major}.${minor}.${patch}`;
    console.log(`Version: ${version}`);

    return new ReplaceInFileWebpackPlugin([
        {
            dir,
            files,
            rules: [
                {
                    search: /{{version}}/ig,
                    replace: version
                },
                {
                    search: /({{major}}|\"{{major}}\")/ig,
                    replace: major
                },
                {
                    search: /({{minor}}|\"{{minor}}\")/ig,
                    replace: minor
                },
                {
                    search: /({{patch}}|\"{{patch}}\")/ig,
                    replace: patch
                }
            ]
        }
    ]);
};

function Pad(text, width, z = '0')
{
    text = text + ''; // convert to string
    while(text.length < width) {
        text = z + text;
    }
    return text;
}

const TsLoaderRule = {
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
};

module.exports = {
    GetTargetPath,
    FillDefaultNodeSettings,
    PackageJsonLoadFixer,
    VersionStringReplacer
}
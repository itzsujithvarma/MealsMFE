const path = require("path");
const HtmlWebpackPlugin = require("html-webpack-plugin");
const ModuleFederationPlugin = require('webpack/lib/container/ModuleFederationPlugin');
const deps = require('./package.json').dependencies;
module.exports = {
    mode: "development",
    devServer: {
        port: 8081
    },
    entry: "/src/index.js", // main js
    module: {
        rules: [
            {
                test: /\.?js$/,
                exclude: /node_modules/,
                use: {
                    loader: "babel-loader",
                    options: {
                        presets: ["@babel/preset-env", "@babel/preset-react"],
                    },
                },
            },
            {
                test: /\.css$/,
                use: [
                    "style-loader",
                    "css-loader", // for styles
                ],
            },
        ],
    },
    plugins: [
        new HtmlWebpackPlugin({
            template: "./src/index.html", // base html
        }),
        new ModuleFederationPlugin({
            name: 'meals',
            filename: 'remoteEntry.js',
            exposes: {
                './MealsIndex': './src/components/Meals/Meals',
            },
            shared: {
                ...deps,
                react: {
                  singleton: true,
                  requiredVersion: deps.react,
                },
                'react-dom': {
                  singleton: true,
                  requiredVersion: deps['react-dom'],
                },
              },
        })
    ],
};
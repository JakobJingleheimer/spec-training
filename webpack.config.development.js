const fs = require('fs');
const path = require('path');

const MiniCssExtractPlugin = require("mini-css-extract-plugin");


const {
	appPaths,
} = require('./config');

const stylesOptions = {
	sourceMap: true,
};

const devWebpackConfig = {
	module: {
		rules: [
			{
				test: /\.(le|c)ss$/,
				use: [
					'style-loader',
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							...stylesOptions
						},
					},
					{
						loader: 'less-loader',
						options: stylesOptions,
					}
				],
			},
		],
	},
	plugins: [
		new MiniCssExtractPlugin({
			chunkFilename: '[id].css',
			filename: '[name].css',
		}),
	],
	devServer: {
		https: {
			ca: fs.readFileSync(path.resolve(appPaths.root, 'generic-localhost_rootCA.pem')),
			cert: fs.readFileSync(path.resolve(appPaths.server, 'server.crt')),
			key: fs.readFileSync(path.resolve(appPaths.server, 'server.key')),
		},
		proxy: {
			// use local file
			'/api/latest.json': {
				bypass() {
					return '/src/client/api/rates/latest.json';
				}
			},
			// proxy to real API
			// '/api': {
			// 	changeOrigin: true,
			// 	target: process.env.OPEN_EXCHANGE_API_HOST,
			// }
		}
	},
	watch: true,
	watchOptions: {
		ignored: /node_modules/,
	},
};

module.exports = devWebpackConfig;

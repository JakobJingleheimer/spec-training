require('dotenv').config();

// native node modules
const path = require('path');

// 3rd-party
const wpMerge = require('webpack-merge');
const webpack = require('webpack');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const PwaManifest = require('webpack-pwa-manifest');


// app
const {
	appPaths,
	client,
	htmlDocument,
	pwaManifest,
} = require('./config');

const CONFIG = {
	apiKey: process.env.OPEN_EXCHANGE_API_KEY,
	env: process.env.NODE_ENV || 'development',
	name: process.env.npm_package_name,
	shortName: process.env.npm_package_shortName,
	version: process.env.npm_package_version,
	...client,
};
const isDev = CONFIG.env === 'development';

const envWebpackConfig = require(`./webpack.config.${CONFIG.env}`) || {};


const baseWebpackConfig = {
	context: appPaths.src,
	devtool: 'source-map', // 'inline-source-map'
	entry: {
		app: [
			path.resolve(appPaths.client, 'index.tsx'),
		],
	},
	mode: CONFIG.env,
	module: {
		rules: [
			{
				sideEffects: false,
			},
			{
				test: /\.eot$|\.ttf$|\.gif$|\.jpe?g$|\.png$|\.svg$/,
				use: [
					{
						loader: 'file-loader',
						options: {
							name: '[name].[hash].[ext]',
						},
					},
				]
			},
			{
				test: /\.woff(2)?(\?v=[0-9]\.[0-9]\.[0-9])?$/,
				use: [
					{
						loader: 'url-loader',
						options: {
							limit: 10000,
							mimetype: 'application/fontwoff',
						},
					},
				],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
			},
			{
				enforce: 'pre',
				test: /\.js$/,
				use: 'source-map-loader',
			},
		],
	},
	optimization: {
		splitChunks: {
			cacheGroups: {
				semanticUi: {
					chunks: 'all',
					name: 'semantic-ui',
					priority: 1,
					test: /semantic-ui/,
				},
				vendor: {
					chunks: 'all',
					name: 'vendor',
					priority: 0,
					test: /node_modules/,
				},
			},
		},
	},
	output: {
		filename: '[name].[hash].bundle.js',
		path: appPaths.dist,
		publicPath: '/',
	},
	plugins: [
		new webpack.DefinePlugin({
			CONFIG: JSON.stringify(CONFIG),
			ENABLE_DEBUGGING: isDev,
		}),
		new HtmlWebpackPlugin(htmlDocument),
		new PwaManifest(pwaManifest),
	],
	resolve: {
		alias: {
			'../../theme.config$': path.join(appPaths.client, 'semantic-ui/theme.config'),
			'@client': appPaths.client,
			'@suir': 'semantic-ui-react/dist/commonjs',
		},
		extensions: [
			'.js',
			'.jsx',
			'.ts',
			'.tsx',
		],
		modules: [
			appPaths.src,
			'node_modules',
		],
	},
};

const webpackConfig = wpMerge(
	baseWebpackConfig,
	envWebpackConfig,
);

module.exports = webpackConfig;

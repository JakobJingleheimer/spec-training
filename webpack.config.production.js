const CleanWebpackPlugin = require('clean-webpack-plugin');
const ManifestPlugin = require('webpack-manifest-plugin');
const MiniCssExtractPlugin = require("mini-css-extract-plugin");
const UglifyEsPlugin = require('uglifyjs-webpack-plugin');


// app
const {
	appPaths,
} = require('./config');

const stylesOptions = {
	sourceMap: true,
};

const prodWebpackConfig = {
	module: {
		rules: [
			{
				test: /\.(le|c)ss$/,
				use: [
					MiniCssExtractPlugin.loader,
					{
						loader: 'css-loader',
						options: {
							importLoaders: 1,
							minimize: {
								// { cssnano options }
							},
							...stylesOptions,
						},
					},
					{
						loader: 'postcss-loader',
						options: {
							ident: 'postcss',
							plugins: [
								require('autoprefixer')(),
							],
							sourceMap: true,
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
	optimization: {
		minimizer: [
			new UglifyEsPlugin({
				parallel: true,
				sourceMap: true,
				uglifyOptions: {
					// warnings: true,
				},
			}),
		],
	},
	plugins: [
		new CleanWebpackPlugin([appPaths.dist]),
		new MiniCssExtractPlugin({
			filename: '[name].[contenthash].bundle.css',
		}),
		new ManifestPlugin(),
	],
};

module.exports = prodWebpackConfig;

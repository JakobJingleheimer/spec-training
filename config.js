// native node modules
const path = require('path');


const appPaths = {
	root: process.cwd(),
};
appPaths.dist = path.resolve(appPaths.root, 'dist')
appPaths.src = path.resolve(appPaths.root, 'src');
appPaths.client = path.resolve(appPaths.src, 'client');
appPaths.server = path.resolve(appPaths.src, 'server');

const package = require(path.resolve(appPaths.root, 'package'));

const client = {
	logLevel: 'debug',
};
const htmlDocument = {
	appMountId: 'app',
	inject: false,
	lang: 'en-UK',
	minify: {
		collapseWhitespace: true,
		minimize: true,
		removeAttributeQuotes: false,
		removeComments: true,
	},
	mobile: true,
	template: require('html-webpack-template'),
	title: package.displayName,
	xhtml: true,
};
const pwaManifest = {
	applications: {
		gecko: {
			id: 'example@example.com',
		},
	},
	author: package.author,
	default_locale: 'en',
	description: package.description,
	display: 'minimal-ui',
	inject: true, // must come after HtmlWebpackPlugin in plugins array
	ios: true,
	manifest_version: 2,
	name: package.displayName,
	permissons: [ // https://developer.chrome.com/extensions/declare_permissions
	],
	short_name: package.shortName,
	start_url: '/',
	version: package.version,
};


module.exports = {
	appPaths,
	client,
	htmlDocument,
	pwaManifest,
};

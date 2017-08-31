let path = require('path');
let CleanWebpackPlugin = require('clean-webpack-plugin');

module.exports = {
	entry: {
		verdor: ['jQuery'],
		home: './src/javascripts/home.js'
	},

	output: {
		path: path.join(__dirname, '/dist'),
		filename: './javascripts/[name].js'
	},

	module:{
		loaders: [
			{
				test: /\.js$/,
				loader: 'babel-loader',
				exclude: /node_modules/,		// 绝对路径或正则匹配
				query: {
					presets: ['env']
				}
			},
			{
				test: /\.scss$/,
				loader: 'style-loader!css-loader!sass-loader'
			}
		]
	},


	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: true,
			dry: false,
			exclude: []
		})

	]



}
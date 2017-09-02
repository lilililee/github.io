const path = require('path');
const CleanWebpackPlugin = require('clean-webpack-plugin');
const ExtractTextPlugin = require('extract-text-webpack-plugin');

module.exports = {
	entry: {
		verdor: ['jQuery'],
		home: './src/javascripts/home.js',
		home2: './src/javascripts/home2.js'
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
				exclude: /node_modules/,		// 绝对路径或正则匹配，可减少打包时间
				query: {
					presets: ['env']
				}
			},
			// {
			// 	test: /\.scss$/,
			// 	loader: 'style-loader!css-loader!postcss-loader!sass-loader'
			// }
			{
				test: /\.scss$/,
		        use: ExtractTextPlugin.extract({
		          fallback: 'style-loader',
		          //resolve-url-loader may be chained before sass-loader if necessary
		          use: ['css-loader', 'postcss-loader', 'sass-loader']
		        })
			}

		]
	},
	devServer: {
	    contentBase: __dirname,//本地服务器所加载的页面所在的目录
	    historyApiFallback: true,//不跳转
	    inline: true//实时刷新
	},


	plugins: [
		new CleanWebpackPlugin(['dist'], {
			root: __dirname,
			verbose: true,
			dry: false,
			exclude: []
		}),
		new ExtractTextPlugin('./stylesheets/style.css')

	]



}
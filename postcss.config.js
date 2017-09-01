module.exports={
	plugins:[
	require("autoprefixer")({
		browsers:[
		// 'ios >= 8',
		// 'Android >= 4',
		// 'ie >= 9'
		'last 3 versions'		// 兼容至ie9
		]}
		)

	]
}
if(process.env.NODE_ENV == 'production'){
	module.exports = {mongoURI:'mongodb://abc:XXXXX@ds163182.mlab.com:63182/idea-dev'}
}else{
	module.exports = {mongoURI:'mongodb://localhost/idea-dev'}
}
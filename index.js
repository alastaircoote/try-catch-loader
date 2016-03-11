module.exports = function(content) {
	return "try {" + content + " } catch (err) { module.exports = null}"
}
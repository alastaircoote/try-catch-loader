module.exports = function() {
	return "This should never run."
}

if (navigator.userAgent === 'blahblah') {
	// something that'll never actually run
}
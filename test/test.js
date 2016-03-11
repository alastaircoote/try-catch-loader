var webpack = require('webpack');
var MemoryFileSystem = require('memory-fs');
var should = require('should');

var getOutput = function(compiler, cb) {
	var memoryfs = new MemoryFileSystem();
    compiler.outputFileSystem = memoryfs;
    compiler.run(function(err, stats) {
    	if (err) {
    		return cb(err);
    	}
    	if (stats.compilation.errors.length > 0) {
    		return cb(stats.compilation.errors[0]);
    	}
    	var jsOutput = memoryfs.readFileSync('/out.js', 'utf-8');
    	var mod = {
    		exports: {}
    	};
    	try {
    		new Function('module','exports',jsOutput)(mod, mod.exports);
    	} catch (err) {
    		return cb(err)
    	}
    	return cb(null, mod.exports);
    });
}

describe("Webpack without try/catch loader", function() {
	it("should process working files fine", function(done) {
		var compiler = webpack({
			entry: __dirname + '/scripts/working.js',
			output: {
				path: '/',
				filename: 'out.js',
				libraryTarget: 'umd'
			}
		});
		getOutput(compiler, function(err, func) {
			func().should.equal("This should always work.")
			done();
		})
	})

	it("should fail on non-working files", function(done) {
		var compiler = webpack({
			entry: __dirname + '/scripts/not-working.js',
			output: {
				path: '/',
				filename: 'out.js',
				libraryTarget: 'umd'
			}
		});
		getOutput(compiler, function(err, func) {
			err.message.should.equal('navigator is not defined');
			done();
		})
	})
})

describe("Webpack with try/catch loader", function() {
	it("should process working files fine", function(done) {
		var compiler = webpack({
			entry: __dirname + '/scripts/working.js',
			output: {
				path: '/',
				filename: 'out.js',
				libraryTarget: 'umd'
			},
			module: {
		        loaders: [
		            { test: /\.js$/, loaders: [__dirname + '/../index']},
	            ]
        	}
		});
		getOutput(compiler, function(err, func) {
			func().should.equal("This should always work.")
			done();
		})
	})

	it("should fail on non-working files", function(done) {
		var compiler = webpack({
			entry: __dirname + '/scripts/not-working.js',
			output: {
				path: '/',
				filename: 'out.js',
				libraryTarget: 'umd'
			},
			module: {
		        loaders: [
		            { test: /\.js$/, loaders: [__dirname + '/../index']},
	            ]
        	}
		});
		getOutput(compiler, function(err, func) {
			should(err).be.null
			should(func).be.null
			done();
		})
	})
})
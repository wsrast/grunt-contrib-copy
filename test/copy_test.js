'use strict';

var grunt = require('grunt'),
	fs = require('fs'),
	isWindows = process.platform === 'win32';

exports.copy = {
	main: function (test) {
		test.expect(3);

		var actual = fs.readdirSync('tmp/copy_test_files').sort();
		var expected = fs.readdirSync('test/expected/copy_test_files').sort();
		test.deepEqual(expected, actual, 'should copy several files');

		actual = fs.readdirSync('tmp/copy_test_mix').sort();
		expected = fs.readdirSync('test/expected/copy_test_mix').sort();
		test.deepEqual(expected, actual, 'should copy a mix of folders and files');

		actual = fs.readdirSync('tmp/copy_test_v0.1.0').sort();
		expected = fs.readdirSync('test/expected/copy_test_v0.1.0').sort();
		test.deepEqual(expected, actual, 'should parse both dest and src templates');

		test.done();
	},

	/**
	 * Normal Windows read-only files throw EPERM errors when you try to copy
	 * over them. Adding force:true to the options should delete the file
	 * before attempting to copy, avoiding task halt.
	 * @param test
	 */
	readOnlyFile: function (test) {
		test.expect(1);

		var actual = fs.readdirSync('tmp/copy_test_readonly').sort();
		var expected = fs.readdirSync('test/expected/copy_test_readonly').sort();
		test.deepEqual(expected, actual, 'should copy over read-only files');

		test.done();
	},

	noexpandWild: function (test) {
		test.expect(3);

		['/', '/test/', '/test/fixtures/'].forEach(function (subpath, i) {
			var actual = fs.readdirSync('tmp/copy_test_noexpandWild' + subpath).sort();
			var expected = fs.readdirSync('test/expected/copy_test_noexpandWild' + subpath).sort();
			test.deepEqual(expected, actual, 'should copy file structure at level ' + i);
		});

		test.done();
	},

	flatten: function (test) {
		test.expect(1);

		var actual = fs.readdirSync('tmp/copy_test_flatten').sort();
		var expected = fs.readdirSync('test/expected/copy_test_flatten').sort();
		test.deepEqual(expected, actual, 'should create a flat structure');

		test.done();
	},

	single: function (test) {
		test.expect(1);

		var actual = grunt.file.read('tmp/single.js');
		var expected = grunt.file.read('test/expected/single.js');
		test.equal(expected, actual, 'should allow for single file copy');

		test.done();
	},

	mode: function (test) {
		test.expect(1);

		test.equal(fs.lstatSync('tmp/mode.js').mode.toString(8).slice(-3), '444');

		test.done();
	},

	modeDir: function (test) {
		test.expect(2);
		// on Windows DIRs do not have 'executable' flag, see
		// https://github.com/nodejs/node/blob/master/deps/uv/src/win/fs.c#L1064
		var expectedMode = isWindows ? '666' : '777';
		test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder').mode.toString(8).slice(-3), expectedMode);
		test.equal(fs.lstatSync('tmp/copy_test_modeDir/time_folder/sub_folder').mode.toString(8)
			.slice(-3), expectedMode);
		test.done();
	},

	process: function (test) {
		test.expect(2);
		test.equal(fs.lstatSync('tmp/process/beep.wav').size, fs.lstatSync('test/fixtures/beep.wav').size);
		test.notEqual(fs.lstatSync('tmp/process/test2.js').size, fs.lstatSync('test/fixtures/test2.js').size);

		test.done();
	},

	timestampEqual: function (test) {
		if (isWindows) {
			// Known Issue: this test will not pass on Windows due to a bug in node.js
			// https://github.com/nodejs/node/issues/2069
			test.done();
			return;
		}
		test.expect(2);
		test.equal(fs.lstatSync('tmp/copy_test_timestamp/sub_folder').mtime
			.getTime(), fs.lstatSync('test/fixtures/time_folder/sub_folder').mtime.getTime());
		test.equal(fs.lstatSync('tmp/copy_test_timestamp/test.js').mtime
			.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
		test.done();
	},

	timestampChanged: function (test) {
		test.expect(2);
		test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test1.js').mtime
			.getTime(), fs.lstatSync('test/fixtures/time_folder/test.js').mtime.getTime());
		test.notEqual(fs.lstatSync('tmp/copy_test_timestamp/test_process.js').mtime
			.getTime(), fs.lstatSync('test/fixtures/time_folder/test_process.js').mtime.getTime());
		test.done();
	}
};

# grunt-contrib-copy-force v0.0.5

> Copy files and folders, overwriting read-only files when force option is true

I'm forking this from the main grunt-contrib-copy package to solve an issue I have with TFS source control making registered files read-only by default. It's very irritating, and I'm shocked that I was unable to find anyone else who'd run into this problem and been forced to solve it in a similar manner.

Hopefully, someone else will find this useful.

## Getting Started

If you haven't used [Grunt](http://gruntjs.com/) before, be sure to check out the [Getting Started](http://gruntjs.com/getting-started) guide, as it explains how to create a [Gruntfile](http://gruntjs.com/sample-gruntfile) as well as install and use Grunt plugins. Once you're familiar with that process, you may install this plugin with this command:

```shell
npm install grunt-contrib-copy-force --save-dev
```

Once the plugin has been installed, it may be enabled inside your Gruntfile with this line of JavaScript:

```js
grunt.loadNpmTasks('grunt-contrib-copy-force');
```

*This plugin was designed to work with Grunt 0.4.x. If you're still using grunt v0.3.x it's strongly recommended that [you upgrade](http://gruntjs.com/upgrading-from-0.3-to-0.4), but in case you can't please use [v0.3.2](https://github.com/gruntjs/grunt-contrib-copy/tree/grunt-0.3-stable).*



## Copy task
_Run this task with the `grunt copy` command._

Task targets, files and options may be specified according to the grunt [Configuring tasks](http://gruntjs.com/configuring-tasks) guide.
### Options

#### force
Type: `Boolean`

Set this to true to force overwrite of read-only files.

#### process
Type: `Function(content, srcpath)`

This option is passed to `grunt.file.copy` as an advanced way to control the file contents that are copied.

*`processContent` has been renamed to `process` and the option name will be removed in the future.*

#### noProcess
Type: `String`

This option is passed to `grunt.file.copy` as an advanced way to control which file contents are processed.

*`processContentExclude` has been renamed to `noProcess` and the option name will be removed in the future.*

#### encoding
Type: `String`  
Default: `grunt.file.defaultEncoding`

The file encoding to copy files with.

#### mode
Type: `Boolean` or `String`  
Default: `false`

Whether to copy or set the destination file and directory permissions.
Set to `true` to copy the existing file and directories permissions.
Or set to the mode, i.e.: `0644`, that copied files will be set to.

#### timestamp
Type: `Boolean`  
Default: `false`

Whether to preserve the timestamp attributes(`atime` and `mtime`) when copying files. Set to `true` to preserve files timestamp. But timestamp will *not* be preserved when the file contents or name are changed during copying.

### Usage Examples

```js
copy: {
  main: {
    files: [
      // includes files within path, overwriting read-only
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile', force: true},
    
      // includes files within path
      {expand: true, src: ['path/*'], dest: 'dest/', filter: 'isFile'},

      // includes files within path and its sub-directories
      {expand: true, src: ['path/**'], dest: 'dest/'},

      // makes all src relative to cwd
      {expand: true, cwd: 'path/', src: ['**'], dest: 'dest/'},

      // flattens results to a single level
      {expand: true, flatten: true, src: ['path/**'], dest: 'dest/', filter: 'isFile'},
    ],
  },
},
```

This task supports all the file mapping format Grunt supports. Please read [Globbing patterns](http://gruntjs.com/configuring-tasks#globbing-patterns) and [Building the files object dynamically](http://gruntjs.com/configuring-tasks#building-the-files-object-dynamically) for additional details.

Here are some additional examples, given the following file tree:
```shell
$ tree -I node_modules
.
├── Gruntfile.js
└── src
    ├── a
    └── subdir
        └── b

2 directories, 3 files
```

**Copy a single file tree:**
```js
copy: {
  main: {
    expand: true,
    src: 'src/*',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 1 directories, copied 1 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   └── src
│       ├── a
│       └── subdir
└── src
    ├── a
    └── subdir
        └── b

5 directories, 4 files
```

**Copying without full path:**
```js
copy: {
  main: {
    expand: true,
    cwd: 'src',
    src: '**',
    dest: 'dest/',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Created 2 directories, copied 2 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   ├── a
│   └── subdir
│       └── b
└── src
    ├── a
    └── subdir
        └── b

5 directories, 5 files
```

**Flattening the filepath output:**

```js
copy: {
  main: {
    expand: true,
    cwd: 'src/',
    src: '**',
    dest: 'dest/',
    flatten: true,
    filter: 'isFile',
  },
},
```

```shell
$ grunt copy
Running "copy:main" (copy) task
Copied 2 files

Done, without errors.
$ tree -I node_modules
.
├── Gruntfile.js
├── dest
│   ├── a
│   └── b
└── src
    ├── a
    └── subdir
        └── b

3 directories, 5 files
```


**Copy and modify a file:**

To change the contents of a file as it is copied, set an `options.process` function as follows:

```js
copy: {
  main: {
    src: 'src/a',
    dest: 'src/a.bak',
    options: {
      process: function (content, srcpath) {
        return content.replace(/[sad ]/g, '_');
      },
    },
  },
},
```

Here all occurrences of the letters "s", "a" and "d", as well as all spaces, will be changed to underlines in "a.bak". Of course, you are not limited to just using regex replacements.

To process all files in a directory, the `process` function is used in exactly the same way.

NOTE: If `process` is not working, be aware it was called `processContent` in v0.4.1 and earlier.


##### Troubleshooting

By default, if a file or directory is not found it is quietly ignored. If the file should exist, and non-existence generate an error, then add `nonull:true`. For instance, this Gruntfile.js entry:

```js
copy: {
  main: {
    nonull: true,
    src: 'not-there',
    dest: 'create-me',
  },
},
```

gives this output:

```shell
$ grunt copy
Running "copy:main" (copy) task
Warning: Unable to read "not-there" file (Error code: ENOENT). Use --force to continue.

Aborted due to warnings.
```



## Release History

 * 2016-05-10   v0.0.5   Adjustments to tag and version number
 * 2016-05-10   v0.0.4   Further edits of package.json and readme.md
 * 2016-05-10   v0.0.3   Initial commits and edits of package.json and readme.md

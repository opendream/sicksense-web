var matchdep = require('matchdep');

module.exports = function(grunt) {
  // Load dependencies automatically with matchdep.
  matchdep.filterDev([
    'grunt-*',
    '!grunt-cli',
    'assemble'
  ]).forEach(grunt.loadNpmTasks);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    clean: {
      build: [ 'build' ]
    },

    sass: {
      options: {
        includePaths: ['app/bower_components/foundation/scss'],
        sourceMap: true
      },
      dist: {
        options: {
          outputStyle: 'nested',
        },
        files: [{
          expand: true,
          cwd: 'app/scss',
          src: [ '**/*.scss' ],
          dest: 'build/css',
          ext: '.css'
        }]
      },
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'app/scss/**/*.scss',
        tasks: ['sass']
      },

      options: {
        livereload: true
      }
    },

    'http-server': {
      'dev': {
        root: 'app',

        port: 8282,

        host: '0.0.0.0',

        showDir: true,
        autoIndex: true,

        ext: 'html',

        runInBackground: true
      }
    },

    minjson: {
      compile: {
        files: [{
          expand: true,
          cwd: 'app/data',
          src: [ '**/*.json' ],
          dest: 'build/data',
          ext: '.min.json'
        }]
      }
    }

  });

  grunt.registerTask('build', [
    'clean',
    'sass',
    'minjson'
  ]);

  grunt.registerTask('default', [
    'http-server:dev',
    'build',
    'watch'
  ]);

};

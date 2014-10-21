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
          dest: 'app/css',
          ext: '.css'
        }]
      },
    },

    // assemble: {
    //   options: {
    //     assets: 'app',
    //     partials: [ 'app/partials', 'app/layouts' ],
    //     layout: false
    //   },
    //   pages: {
    //     src: [ 'app/*.hbs' ],
    //     dest: 'build'
    //   }
    // },

    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: 'app',
          src: '*.html',
          dest: 'build'
        }]
      }
    },

    useminPrepare: {
      html: 'app/index.html',
      options: {
        dest: 'build',
        flow: {
          html: {
            steps: {
              js: [ 'concat' ]
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: 'build/index.html',
      options: {
        assetsDirs: [ 'app' ]
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'app/scss/**/*.scss',
        tasks: [ 'sass' ]
      },

      minjson: {
        files: 'app/data/**/*.json',
        tasks: [ 'minjson:dev' ]
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
      dev: {
        files: [{
          expand: true,
          cwd: 'app/data',
          src: [ '**/*.json' ],
          dest: 'app/data',
          ext: '.min.json'
        }]
      },
      prod: {
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
    'sass:dist',
    'minjson:prod',
    'useminPrepare',
    'copy:prod',
    'usemin',
    'concat',
  ]);

  grunt.registerTask('default', [
    'http-server:dev',
    'clean',
    'sass',
    'minjson:dev',
    'watch'
  ]);

};

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
      build: [ 'app/data/**/*.min.json', 'app/html', 'build' ]
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

    assemble: {
      options: {
        assets: 'app',
        partials: [ 'app/partials/**/*.hbs' ],
        layout: [ 'default.hbs' ],
        layoutdir: 'app/layouts',
        helpers: [ 'handlebars-helper-isActivex' ]
      },
      dev: {
        expand: true,
        cwd: 'app/views',
        src: [ '**/*.hbs' ],
        dest: 'app',
        ext: '.html'
      },
      prod: {
        expand: true,
        cwd: 'app/views',
        src: [ '**/*.hbs' ],
        dest: 'build',
        ext: '.html'
      }
    },

    copy: {
      prod: {
        files: [{
          expand: true,
          cwd: 'app/js',
          src: [ '**/*.js' ],
          dest: 'build/js'
        }, {
          expand: true,
          cwd: 'app',
          src: [
            '*.html',
            'bower_components/typicons/**/*',
            'images/**/*',
            'fonts/**/*',
          ],
          dest: 'build'
        }]
      }
    },

    ngAnnotate: {
      generated: {
        files: [{
          expand: true,
          cwd: 'build/js',
          src: '*.js',
          dest: 'build/js'
        }]
      }
    },

    uglify: {
      generated: {
        files: [{
          expand: true,
          cwd: 'build/js',
          src: [
            'admin.min.js',
            'app.min.js',
            'vendor-footer.min.js',
            'vendor-header.min.js',
            'vendor-footer-admin.min.js',
            'vendor-header-admin.min.js'
          ],
          dest: 'build/js',
          ext: '.min.js'
        }]
      }
    },

    cssmin: {
      generated: {
        files: [{
          expand: true,
          cwd: 'build/css',
          src: [ '*.css', '!*.min.css' ],
          dest: 'build/css',
          ext: '.min.css'
        }]
      }
    },

    useminPrepare: {
      html: [ 'app/*.html' ],
      options: {
        dest: 'build',
        flow: {
          html: {
            steps: {
              js: [ 'concat' ],
              css: [ 'concat' ]
            },
            post: {}
          }
        }
      }
    },

    usemin: {
      html: 'build/*.html',
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

      assemble: {
        files: 'app/**/*.hbs',
        tasks: [ 'assemble:dev' ]
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
          src: [ '**/*.json', '!**/*.min.json' ],
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
    'assemble:dev',
    'useminPrepare',
    'copy',
    'concat',
    'usemin',
    // 'cssmin',
    'ngAnnotate',
    'uglify'
  ]);

  grunt.registerTask('default', [
    'http-server:dev',
    'clean',
    'sass:dist',
    'minjson:dev',
    'assemble:dev',
    'watch'
  ]);

};

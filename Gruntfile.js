var useDelims = require('handlebars-delimiters');

module.exports = function(grunt) {
  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    sass: {
      options: {
        includePaths: ['bower_components/foundation/scss'],
        sourceMap: true
      },
      dist: {
        options: {
          outputStyle: 'nested',
        },
        files: [{
          expand: true,
          cwd: 'scss',
          src: [ '*.scss' ],
          dest: 'css',
          ext: '.css'
        }]
      },
    },

    assemble: {
      options: {
        partials: ['views/partials/**/*.hbs', 'views/layouts/*.hbs'],
        // layout: ['views/layouts/base.hbs']
        layout: false,
        // layoutdir: 'views/layouts'
      },
      site: {
        expand: true,
        src: ['views/*.hbs'],
        dest: './dist/',
        flatten: true
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['views/layouts/base.hbs'],
        cwd: '',
        dependencies: true
      }
    },

    sync: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          dest: 'dist',
          src: [
            '!**/.git',
            'js/**/*.js',
            'js/**/*.json',
            'bower_components/**/*',
            'css/**/*.css',
            'images/**/*',
            'fonts/**/*'
          ]
        }]
      }
    },

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },

      // nunjucks: {
      //   files: 'views/*',
      //   tasks: ['nunjucks']
      // },

      assemble: {
        files: 'views/**/*',
        tasks: ['assemble']
      },

      options: {
        livereload: false
      }
    },

    'http-server': {
      'dev': {
        root: './dist',

        port: 8282,

        host: '0.0.0.0',

        showDir: true,
        autoIndex: true,
        defaultExt: 'html',

        runInBackground: true
      }
    },

    minjson: {
      compile: {
        files: [{
          expand: true,
          src: 'js/*.json',
          dest: 'dist',
          ext: '.min.json'
        }]
      }
    }
  });

  // grunt.loadNpmTasks('grunt-sass');
  // grunt.loadNpmTasks('grunt-contrib-watch');
  // grunt.loadNpmTasks('grunt-minjson');
  // grunt.loadNpmTasks('grunt-http-server');
  // grunt.loadNpmTasks('grunt-nunjucks');
  grunt.loadNpmTasks('assemble');

  grunt.registerTask('build', ['bowerInstall','assemble','sass','minjson','sync']);
  grunt.registerTask('default', ['http-server:dev','build','watch']);
}

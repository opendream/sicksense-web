module.exports = function(grunt) {
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

    watch: {
      grunt: { files: ['Gruntfile.js'] },

      sass: {
        files: 'scss/**/*.scss',
        tasks: ['sass']
      },

      options: {
        livereload: true
      }
    },
    
    'http-server': {
      'dev': {
        root: './',
        
        port: 8282,
        
        host: '127.0.0.1',
        
        showDir: true,
        autoIndex: true,
        defaultExt: 'html',
        
        runInBackground: true
      }
    },

    minjson: {
      compile: {
        files: {
          'dist/js/region.min.json': 'js/region.json',
          'dist/js/provinces.min.json': 'js/provinces.json'
        }
      }
    }
  });

  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-minjson');
  grunt.loadNpmTasks('grunt-http-server');

  grunt.registerTask('build', ['sass','minjson']);
  grunt.registerTask('default', ['http-server:dev','build','watch']);
}

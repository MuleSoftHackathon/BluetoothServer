'use strict';

module.exports = function(grunt){

  grunt.initConfig({
    jshint: {
      options: {
        jshintrc: '.jshintrc'
      },
      all: {
        src: ['Gruntfile.js', './app/**/*.js']
      }
    }
  });

  // Default task(s).
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.registerTask('default', [
    'jshint'
  ]);
};

module.exports = function (grunt) {
  'use strict';

  grunt.util.linefeed = '\n';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*\n' +
    ' * OBS WebSocket Javascript API (<%= pkg.name %>) v<%= pkg.version %>\n' +
    ' * Author: <%= pkg.author %>\n' +
    ' * Repository: <%= pkg.repoUrl %>\n' +
    ' * Built from Commit SHA: <%= pkg.sha %>\n' +
    ' * Build Timestamp: <%= pkg.timestamp %>\n' +
    ' */\n\n',

    webpack: {
      options: require('./webpack.config.js'),
      obswebsocket: {
        failOnError: false
      },
      obswebsocketWatch: {
        failOnError: false,
        watch: true
      }
    },
    clean: {
      dist: 'dist'
    },
    concat: {
      options: {
        banner: '<%= banner %>',
        stripBanners: false
      },
      obswebsocket: {
        src: 'dist/obs-websocket.js',
        dest: 'dist/obs-websocket.js'
      }
    }
  });

  require('load-grunt-tasks')(grunt, {scope: 'devDependencies'});

  grunt.registerTask('build', ['clean:dist', 'webpack:obswebsocket', 'concat']);
  grunt.registerTask('watch', ['webpack:obswebsocketWatch']);
  grunt.registerTask('default', ['build']);
};

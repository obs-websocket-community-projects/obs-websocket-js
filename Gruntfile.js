module.exports = function(grunt) {
  'use strict';

  grunt.util.linefeed = '\n';
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    banner: '/*!\n' +
    ' * OBS WebSocket Javascript API (<%= pkg.name %>) v<%= pkg.version %>\n' +
    ' * Author: <%= pkg.author %>\n' +
    ' * Repo: <%= pkg.repository.url %>\n' +
    ' */\n\n' +
    '\'use strict\';\n\n',

    jsdoc2md: {
      docs: {
        src: ['src/obs-source.js', 'src/obs-scene.js', 'src/obs-websocket.js', 'src/obs-events.js', 'src/obs-requests.js'],
        dest: 'dist/DOCUMENTATION.md'
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
        // src: ['src/*.js'],
        //dest: 'dist/<%= pkg.name %>.js'
        src: ['src/obs-source.js', 'src/obs-scene.js', 'src/obs-websocket.js', 'src/obs-crypto.js', 'src/obs-events.js', 'src/obs-requests.js'],
        dest: 'dist/obs-websocket.js'
      }
    },
    watch: {
      scripts: {
        files: ['src/**/*.js'],
        tasks: ['build'],
        options: {
          debounceDelay: 1000
        }
      }
    }
  });

  require('load-grunt-tasks')(grunt, { scope: 'devDependencies' });

  grunt.registerTask('build', ['clean:dist', 'concat']);
  grunt.registerTask('default', ['build', 'jsdoc2md']);
};

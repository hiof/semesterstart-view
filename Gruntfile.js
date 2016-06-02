module.exports = function(grunt) {
  // Loads each task referenced in the packages.json file
  require("matchdep").filterDev("grunt-*").forEach(grunt.loadNpmTasks);
  require('time-grunt')(grunt);

  // Initiate grunt tasks
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),
    moment: require('moment'),
    // Tasks
    sass: {
      options: {

      },
      dist: {
        files: {
          'build/<%= pkg.name %>.css': 'app/assets/sass/<%= pkg.name %>.scss'
        }
      }
    },
    autoprefixer: {
      options: {
        browsers: ['last 2 versions', 'ie 8', 'ie 9']
        //diff: 'build/config/*.diff'
      },
      prefix: {
        expand: true,
        //flatten: true,
        src: 'build/*.css'
        //dest: 'tmp/css/prefixed/'
      }
    },
    cssmin: {
      main: {
        options: {
          banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %>, released: <%= moment().format("hh:mm DD-MM-YYYY") %> */'
        },
        expand: true,
        cwd: 'build',
        src: ['*.css', '!*.min.css'],
        dest: 'build/',
        ext: '.v<%= pkg.version %>.min.css'
      }
    },
    copy: {
      jstemplates: {
        expand: true,
        cwd: 'vendor/frontend/app/templates/',
        src: '**',
        dest: 'build/templates/',
        filter: 'isFile'
      },
      dist: {
        expand: true,
        cwd: 'build/',
        src: '**',
        dest: 'dist',
        filter: 'isFile'
      }
    },
    clean: {
      options: {
        force: true
      },
      dist: ['dist/**/*'],
      deploy: ['deploy/**/*'],
      build: ['build/**/*']
    },

    jshint: {
      options: {
        ignores: ['app/assets/js/templates/templates.js']
      },
      files: ['app/assets/js/**/*.js', 'Gruntfile.js', 'bower.json', 'package.json']
    },
    handlebars: {
      options: {
        namespace: 'Hiof.Templates',
        processName: function(filePath) {
          if (filePath.substring(0, 4) === 'vend') {
            return filePath.replace(/^vendor\/page-view\/app\/templates\//, '').replace(/\.hbs$/, '');
          } else {
            return filePath.replace(/^app\/templates\//, '').replace(/\.hbs$/, '');
          }
        }
      },
      all: {
        files: {
          "build/templates.js": ["app/templates/**/*.hbs", "vendor/page-view/app/templates/**/*.hbs"]
        }
      }
    },
    concat: {
      scripts: {
        src: [
          'build/templates.js',
          'app/assets/js/components/_component_semesterstart.js'
        ],
        dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.js'
      }
    },
    uglify: {
      options: {
        mangle: false,
        //compress: true,
        preserveComments: false,
        banner: '/*! <%= pkg.name %> v<%= pkg.version %> by <%= pkg.author %>, released: <%= moment().format("hh:mm DD-MM-YYYY") %> */'
      },
      main: {
        files: {
          'build/<%= pkg.name %>.v<%= pkg.version %>.min.js': ['build/<%= pkg.name %>.v<%= pkg.version %>.min.js']
        }
      }
    },
    jsdoc : {
      dist : {
        src: ['app/assets/js/components/*.js'],
        options: {
          destination : 'doc',
          //template : "node_modules/jsdoc/template/haruki",
          //configure : "node_modules/ink-docstrap/template/jsdoc.conf.json"
        }
      }
    },
    jsdoc2md: {
      oneOutputFile: {
        src: 'app/assets/js/components/*.js',
        dest: 'doc/documentation.md'
      },
    },

    versioning: {
      options: {
        cwd: 'build/',
        outputConfigDir: 'build/',
        namespace: 'hiof'
      },
      build: {
        files: [{
          assets: [{
            src: ['build/<%= pkg.name %>.v<%= pkg.version %>.min.js'],
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.js'
          }],
          key: 'assets',
          dest: '',
          type: 'js',
          ext: '.min.js'
        }, {
          assets: [{
            src: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css',
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css'
          }],
          key: 'assets',
          dest: '',
          type: 'css',
          ext: '.min.css'
        }]
      },
      deploy: {
        options: {
          output: 'php',
          outputConfigDir: 'build/',
        },
        files: [{
          assets: [{
            src: ['build/<%= pkg.name %>.v<%= pkg.version %>.min.js'],
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.js'
          }],
          key: 'assets',
          dest: '',
          type: 'js',
          ext: '.min.js'
        },

        {
          assets: [{
            src: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css',
            dest: 'build/<%= pkg.name %>.v<%= pkg.version %>.min.css'
          }],
          key: 'assets',
          dest: '',
          type: 'css',
          ext: '.min.css'
        }
      ]
    }
  },
  secret: grunt.file.readJSON('secret.json'),
  sftp: {
    stage: {
      files: {
        "./": "dist/**"
      },
      options: {
        path: '<%= secret.stage.path %>',
        srcBasePath: "dist/",
        host: '<%= secret.stage.host %>',
        username: '<%= secret.stage.username %>',
        password: '<%= secret.stage.password %>',
        //privateKey: grunt.file.read('id_rsa'),
        //passphrase: '<%= secret.passphrase %>',
        showProgress: true,
        createDirectories: true,
        directoryPermissions: parseInt(755, 8)
      }
    },
    prod: {
      files: {
        "./": "dist/**"
      },
      options: {
        path: '<%= secret.prod.path %>',
        srcBasePath: "dist/",
        host: '<%= secret.prod.host %>',
        username: '<%= secret.prod.username %>',
        password: '<%= secret.prod.password %>',
        //privateKey: grunt.file.read('id_rsa'),
        //passphrase: '<%= secret.passphrase %>',
        showProgress: true,
        createDirectories: true,
        directoryPermissions: parseInt(755, 8)
      }
    }
  }
  //watch: {
  //  hbs: {
  //    files: ['app/templates/**/*.hbs'],
  //    tasks: ['handlebars', 'copy:jstemplates'],
  //    options: {
  //      livereload: true,
  //    },
  //  },
  //  js: {
  //    files: ['app/assets/js/**/*.js', 'app/assets/js/**/*.json'],
  //    tasks: ['jshint', 'concat:scripts', 'versioning:build'],
  //    options: {
  //      livereload: true,
  //    },
  //  },
  //}

});

grunt.registerTask('subtaskJs', ['handlebars','jshint', 'concat:scripts', 'uglify', 'copy:jstemplates']);
grunt.registerTask('subtaskCss', ['sass', 'autoprefixer', 'cssmin']);

grunt.registerTask('build', ['clean:build', 'clean:dist', 'subtaskJs', 'subtaskCss', 'versioning:build']);
grunt.registerTask('deploy', ['clean:build', 'clean:dist', 'subtaskJs', 'subtaskCss', 'versioning:deploy', 'copy:dist']);



grunt.registerTask('deploy-staging', ['deploy', 'sftp:stage']);
grunt.registerTask('deploy-prod', ['deploy', 'sftp:prod']);

};

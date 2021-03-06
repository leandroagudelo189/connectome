// Generated on 2014-04-10 using generator-angular 0.8.0
'use strict';

// # Globbing
// for performance reasons we're only matching one level down:
// 'test/spec/{,*/}*.js'
// use this if you want to recursively match all subfolders:
// 'test/spec/**/*.js'

module.exports = function (grunt) {

  // Load grunt tasks automatically
  require('load-grunt-tasks')(grunt);

  // Time how long tasks take. Can help when optimizing build times
  require('time-grunt')(grunt);

  // Define the configuration for all the tasks
  grunt.initConfig({

    // Project settings
    build: {
      // configurable paths
      app: 'app',
      dist: 'dist',
      prod: '/cygdrive/w/home/harshbarger/ligand-receptor'
    },

    // Watches files for changes and runs tasks based on the changed files
    watch: {
      bower: {
        files: ['bower.json'],
        tasks: ['bowerInstall']
      },
      js: {
        files: ['<%= build.app %>/components/**/*.js'],
        tasks: ['newer:jshint:all'],
        options: {
          livereload: '<%= connect.options.livereload %>'
        }
      },
      styles: {
        files: ['<%= build.app %>/components/**/*.css'],
        tasks: ['newer:copy:styles','autoprefixer']
      },
      //styles: {
      //  files: ['<%= build.app %>/styles/**/*.css'],
      //  tasks: ['newer:copy:styles', 'newer:copy:dist','autoprefixer']
      //},
      //jsTest: {
      //  files: ['test/spec/{,*/}*.js'],
      //  tasks: ['newer:jshint:test', 'karma']
     // },
      gruntfile: {
        files: ['Gruntfile.js']
      },
      livereload: {
        options: {
          livereload: '<%= connect.options.livereload %>'
        },
        files: [
          '<%= build.app %>/{,*/}*.html',
          '<%= build.app %>/components/**/*.html',
          '.tmp/components/**/*.css',
          '<%= build.app %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}'
        ]
      }
    },

    // The actual grunt server settings
    connect: {
      options: {
        port: 9000,
        // Change this to '0.0.0.0' to access the server from outside.
        hostname: 'localhost',
        livereload: 35730
      },
      livereload: {
        options: {
          open: true,
          base: [
            '.tmp',
            '<%= build.app %>'
          ]
        }
      },
      test: {
        options: {
          port: 9001,
          base: [
            '.tmp',
            'test',
            '<%= build.app %>'
          ]
        }
      },
      dist: {
        options: {
          base: '<%= build.dist %>'
        }
      }
    },

    // Make sure code styles are up to par and there are no obvious mistakes
    jshint: {
      options: {
        jshintrc: '.jshintrc',
        reporter: require('jshint-stylish')
      },
      all: [
        'Gruntfile.js',
        '<%= build.app %>/components/**/*.js',
        '!<%= build.app %>/components/tree/d3.hive.v0.js'
      ],
      test: {
        options: {
          jshintrc: 'test/.jshintrc'
        },
        src: ['test/spec/{,*/}*.js']
      }
    },

    // Empties folders to start fresh
    clean: {
      dist: {
        files: [{
          dot: true,
          src: [
            '.tmp',
            '<%= build.dist %>/*',
            '!<%= build.dist %>/.git*'
          ]
        }]
      },
      server: '.tmp'
    },

    // Add vendor prefixed styles
    autoprefixer: {
      options: {
        browsers: ['last 1 version']
      },
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/components/',
          src: '**/*.css',
          dest: '.tmp/components/'
        }]
      }
    },

    // Automatically inject Bower components into the app
    bowerInstall: {
      app: {
        src: ['<%= build.app %>/index.html'],
        ignorePath: '<%= build.app %>/',
        //exclude: [ /chosen\.jquery\.js/ ]
        overrides: {
          chosen: {
            main: 'bower_components/chosen/chosen.jquery.js'
          }
        }
      }
    },

    // Renames files for browser caching purposes
    rev: {
      dist: {
        files: {
          src: [
            '<%= build.dist %>/scripts/{,*/}*.js',
            '<%= build.dist %>/styles/{,*/}*.css',
            '<%= build.dist %>/images/{,*/}*.{png,jpg,jpeg,gif,webp,svg}',
            '<%= build.dist %>/styles/fonts/*'
          ]
        }
      }
    },

    // Reads HTML for usemin blocks to enable smart builds that automatically
    // concat, minify and revision files. Creates configurations in memory so
    // additional tasks can operate on them
    useminPrepare: {
      html: '<%= build.app %>/index.html',
      options: {
        dest: '<%= build.dist %>',
        flow: {
          html: {
            steps: {
              js: ['concat', 'uglifyjs'],
              css: ['cssmin']
            },
            post: {}
          }
        }
      }
    },

    // Performs rewrites based on rev and the useminPrepare configuration
    usemin: {
      html: ['<%= build.dist %>/{,*/}*.html'],
      css: ['<%= build.dist %>/styles/**/*.css'],
      options: {
        assetsDirs: ['<%= build.dist %>']
      }
    },

    // The following *-min tasks produce minified files in the dist folder
    cssmin: {
      options: {
        //root: '<%= build.app %>'
      }
    },

    imagemin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= build.app %>/images',
          src: '{,*/}*.{png,jpg,jpeg,gif}',
          dest: '<%= build.dist %>/images'
        }]
      }
    },

    svgmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '<%= build.app %>/images',
          src: '{,*/}*.svg',
          dest: '<%= build.dist %>/images'
        }]
      }
    },

    htmlmin: {
      dist: {
        options: {
          collapseWhitespace: false,
          collapseBooleanAttributes: true,
          removeCommentsFromCDATA: true,
          removeOptionalTags: false
        },
        files: [{
          expand: true,
          cwd: '<%= build.dist %>',
          src: ['*.html', 'components/**/*.html'],
          dest: '<%= build.dist %>'
        }]
      }
    },

    // ngmin tries to make the code safe for minification automatically by
    // using the Angular long form for dependency injection. It doesn't work on
    // things like resolve or inject so those have to be done manually.
    ngmin: {
      dist: {
        files: [{
          expand: true,
          cwd: '.tmp/concat/scripts',
          src: '*.js',
          dest: '.tmp/concat/scripts'
        }]
      }
    },

    // Replace Google CDN references
    cdnify: {
      dist: {
        html: ['<%= build.dist %>/*.html']
      }
    },

    // Copies remaining files to places other tasks can use
    copy: {
      dist: {
        files: [{
          expand: true,
          dot: true,
          cwd: '<%= build.app %>',
          dest: '<%= build.dist %>',
          src: [
            '*.{ico,png,txt}',
            '.htaccess',
            '*.html',
            'views/{,*/}*.html',
            'images/{,*/}*.{webp}',
            'components/{,*/}*.html',
            'data/*.txt',
            'fonts/*'
          ]
        }, {
          expand: true,
          cwd: '.tmp/images',
          dest: '<%= build.dist %>/images',
          src: ['generated/*']
        }, {
          expand: true,
          cwd: '<%= build.app %>/bower_components/chosen',
          dest: '<%= build.dist %>/styles',
          src: ['*.png']
        }, {
          expand: true,
          cwd: '<%= build.app %>/bower_components/select2',
          dest: '<%= build.dist %>/styles',
          src: ['*.png','*.gif']
        }]
      },
      styles: {
        expand: true,
        cwd: '<%= build.app %>/components',
        dest: '.tmp/components',
        src: '**/*.css'
      },
      fonts: {
        expand: true,
        cwd: '<%= build.app %>/bower_components/bootstrap/dist/',
        dest: '<%= build.dist %>',
        src: 'fonts/*.*'
      },
      'fonts-fa': {
        expand: true,
        cwd: '<%= build.app %>/bower_components/font-awesome/',
        dest: '<%= build.dist %>',
        src: 'fonts/*.*'
      }
    },

    // Run some tasks in parallel to speed up the build process
    concurrent: {
      server: [
        'copy:styles'
      ],
      test: [
        'copy:styles'
      ],
      dist: [
        'copy:styles',
        'copy:fonts',
        'copy:fonts-fa',
        'imagemin',
        'svgmin'
      ]
    },

    // By default, your `index.html`'s <!-- Usemin block --> will take care of
    // minification. These next options are pre-configured if you do not wish
    // to use the Usemin blocks.
    // cssmin: {
    //   dist: {
    //     files: {
    //       '<%= build.dist %>/styles/main.css': [
    //         '.tmp/styles/{,*/}*.css',
    //         '<%= build.app %>/styles/{,*/}*.css'
    //       ]
    //     }
    //   }
    // },
    // uglify: {
    //   dist: {
    //     files: {
    //       '<%= build.dist %>/scripts/scripts.js': [
    //         '<%= build.dist %>/scripts/scripts.js'
    //       ]
    //     }
    //   }
    // },
    // concat: {
    //   dist: {}
    // },

    // Test settings
    karma: {
      unit: {
        configFile: 'karma.conf.js',
        singleRun: true
      }
    },

    // Rsync to 'production" server
    rsync: {
      options: {
        args: ['--verbose','--delete'],
        recursive: true,
        exclude: ['.git*']
      },
      prod: {
        options: {
          src: '<%= build.dist %>/',
          dest: '<%= build.prod %>'
        }
      }
    },

    'gh-pages': {
      options: {
        base: 'dist'
      },
      src: ['**']
    }

  });


  grunt.registerTask('serve', function (target) {
    if (target === 'dist') {
      return grunt.task.run(['build', 'connect:dist:keepalive']);
    }

    grunt.task.run([
      'clean:server',
      'bowerInstall',
      'concurrent:server',
      'autoprefixer',
      'connect:livereload',
      'watch'
    ]);
  });

  grunt.registerTask('test', [
    'clean:server',
    'concurrent:test',
    'autoprefixer',
    'connect:test',
    'karma'
  ]);

  grunt.registerTask('build', [
    'clean:dist',
    'bowerInstall',
    'useminPrepare',
    'concurrent:dist',
    'autoprefixer',
    'concat',
    'ngmin',
    'copy:dist',
    //'cdnify',
    'cssmin',
    'uglify',
    'rev',
    'usemin',
    'htmlmin'
  ]);

  grunt.registerTask('deploy', [
    'build',
    'gh-pages'
  ]);

  grunt.registerTask('default', [
    'jshint',
    'test',
    'build'
  ]);

};

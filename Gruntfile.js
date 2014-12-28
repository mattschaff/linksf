module.exports = function(grunt) {
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    jshint: {
      files: [
        'app/**/*.js',
        'admin/**/*.js',
        'test/**/*.js',
        'shared/**/*.js',
        'server/**/*.js'
      ],
      options: {
        globals: {
          window: true,
          document: true,
          navigator: true,
          console: true,
          module: true,
          require: true,
          FastClick: true,
          $: true,
          Backbone: true,
          Parse: true,
          Handlebars: true,
          _: true,
          google: true,
          parseAppId: true,
          parseJSKey: true,
          ga: true,
          test: true,
          ok: true,
          equal: true,
          deepEqual: true
        },
        undef: true,
        debug: true,
        '-W030': true
      }
    },

    simplemocha: {
      options: {
        timeout: 3000,
        ignoreLeaks: false,
        ui: 'bdd',
        reporter: 'dot'
      },

      all: {src: 'test/unit/**/*.js'}
    },

    watch: {
      files: [
        'Gruntfile.js',
        'app/**/*',
        'admin/**/*',
        'shared/**/*',
        'server/**/*',
        'vendor/**/*',
        '!vendor/**/*.min.*',
        'test/**/*'
      ],
      tasks: ['default']
    },

    sass: {
      options: {includePaths: ['.']},
      app: {src: 'app/css/app.scss', dest: 'tmp/linksf.css'},
      admin: {src: 'admin/css/admin.scss', dest: 'tmp/linksf_admin.css'}
    },

    browserify: {
      options: {
        // We want `.hbs` files to be `require`able. We use the hbsfy transform
        // to precompile Handlebars templates and let us require the compiled
        // JavaScript functions.
        transform: ['hbsfy']
      },
      app: {
        // The entry point where Browserify will begin searching the AST for `require` calls
        src: 'app/js/app.js',

        // The built file
        dest: 'tmp/app.js',

        options: {
          // We want alias mappings because we'd rather
          // `require('views/index_view')` than `require('./views/index_view.js')`
          //
          // There is a tradeoff for convenience here - all aliased files are exported
          // into the built app.js file, even if they're never explicitly
          // `require`d from the entry point tree.
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'app/js/lib',            src: '*.js',  dest: 'lib' },
            { cwd: 'app/js/models',         src: '*.js',  dest: 'models' },
            { cwd: 'app/js/collections',    src: '*.js',  dest: 'collections' },
            { cwd: 'app/js/routers',        src: '*.js',  dest: 'routers' },
            { cwd: 'app/js/templates',      src: '*.hbs', dest: 'templates' },
            { cwd: 'app/js/views',          src: '*.js',  dest: 'views' }
          ]
        }
      },

      admin: {
        src: 'admin/js/admin.js',
        dest: 'tmp/admin.js',
        options: {
          aliasMappings: [
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'shared/lib' },
            { cwd: 'shared/js/lib',         src: '*.js',  dest: 'cloud/lib' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'shared/models' },
            { cwd: 'shared/js/models',      src: '*.js',  dest: 'cloud/models' },
            { cwd: 'shared/js/collections', src: '*.js',  dest: 'shared/collections' },
            { cwd: 'shared/js/views',       src: '*.js',  dest: 'shared/views' },
            { cwd: 'shared/js/templates',   src: '*.hbs', dest: 'shared/templates' },
            { cwd: 'admin/js/lib',          src: '*.js',  dest: 'lib' },
            { cwd: 'admin/js/models',       src: '*.js',  dest: 'models' },
            { cwd: 'admin/js/collections',  src: '*.js',  dest: 'collections' },
            { cwd: 'admin/js/routers',      src: '*.js',  dest: 'routers' },
            { cwd: 'admin/js/templates',    src: '*.hbs', dest: 'templates' },
            { cwd: 'admin/js/views',        src: '*.js',  dest: 'views' }
          ]
        }
      }
    },

    cssmin: {
      app: {src: 'tmp/linksf.css', dest: 'tmp/linksf.css'},
      admin: {src: 'tmp/linksf_admin.css', dest: 'tmp/linksf_admin.css'}
    },

    concat: {
      // Not a target, just a variable that we can interpolate in elsewhere.
      shared_js: [
        'vendor/js/jquery-2.0.3.js',
        'vendor/js/jquery.serialize-object.js',
        'vendor/js/underscore.js',
        'vendor/js/backbone-1.0.0.js',
        'vendor/js/parse-1.2.12.js'
      ],

      shared_js_minified: [
        'vendor/js/jquery-2.0.3.min.js',
        'vendor/js/jquery.serialize-object.min.js',
        'vendor/js/underscore.min.js',
        'vendor/js/backbone-1.0.0.min.js',
        'vendor/js/parse-1.2.12.min.js'
      ],

      app: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.switch.js',
          'vendor/js/bootstrap-button.js',
          'vendor/js/fastclick.js',
          'tmp/app.js'
        ],
        dest: 'tmp/linksf.js'
      },

      app_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.switch.min.js',
          'vendor/js/bootstrap-button.min.js',
          'vendor/js/fastclick.min.js',
          'tmp/app.min.js'
        ],
        dest: 'tmp/linksf.js'
      },

      admin: {
        src: [
          '<%= concat.shared_js %>',
          'vendor/js/backbone_filters.js',
          'vendor/js/jquery.autosize.js',
          'vendor/js/bootstrap.js',
          'tmp/admin.js'
        ],
        dest: 'tmp/linksf_admin.js'
      },

      admin_min: {
        src: [
          '<%= concat.shared_js_minified %>',
          'vendor/js/backbone_filters.min.js',
          'vendor/js/jquery.autosize.min.js',
          'vendor/js/bootstrap.min.js',
          'tmp/admin.min.js'
        ],
        dest: 'tmp/linksf_admin.js'
      }
    },

    uglify: {
      options: {
        mangle: false,
        preserveComments: false,
        report: 'min'
      },

      vendor: {
        files: {
          'vendor/js/jquery.serialize-object.min.js': 'vendor/js/jquery.serialize-object.js',
          'vendor/js/backbone_filters.min.js': 'vendor/js/backbone_filters.js',
          'vendor/js/bootstrap-button.min.js': 'vendor/js/bootstrap-button.js'
        }
      },
      app: {files: {'tmp/app.min.js': 'tmp/app.js'}},
      admin: {files: {'tmp/admin.min.js': 'tmp/admin.js'}}
    },

    clean: {
      build: {src: 'build/*', filter: function(filepath) {return filepath !== 'build/.gitkeep';}},
      tmp: {src: 'tmp/*', filter: function(filepath) {return filepath !== 'tmp/.gitkeep'; }},
      test: {src: 'test/acceptance/app.html'}
    },

    cachebuster: {
      all: {
        files: {src: ['tmp/*.js', 'tmp/*.css']},
        options: {
          complete: function(hashes) {
            var keyMap = {
              'tmp/linksf.js':        'appJs',
              'tmp/linksf.css':       'appCss',
              'tmp/linksf_admin.js':  'adminJs',
              'tmp/linksf_admin.css': 'adminCss'
            };

            var context = {
              parseAppId: process.env.PARSE_APP_ID,
              parseJsKey: process.env.PARSE_JS_KEY,
              gaToken:    process.env.GOOGLE_ANALYTICS_TOKEN,
              gaHost:     process.env.GOOGLE_ANALYTICS_HOST
            };

            Object.keys(hashes).forEach(function(key) {
              var matches = key.match(/^tmp\/(.*)(\..*)$/); // tmp/(filename)(.js)
              var outputFile = 'build/' + matches[1] + '-' + hashes[key] + matches[2];

              grunt.file.copy(key, outputFile);
              context[keyMap[key]] = outputFile;
            });

            grunt.file.write('index.html',
              grunt.template.process(grunt.file.read('app/index.html'), {data: context})
            );

            grunt.file.write('admin.html',
              grunt.template.process(grunt.file.read('admin/admin.html'), {data: context})
            );

            grunt.file.write('test/acceptance/app.html',
              grunt.template.process(grunt.file.read('test/acceptance/app.template'), {data: context})
            );
          }
        }
      }
    },

    qunit: {all: ['test/acceptance/**/*.html']},

    env: {
      dev: {src: '.env.dev'},
      prod: {src: '.env.prod'}
    },

    autoprefixer: {
      options: {
        browsers: [
          'android >= 2.3',
          'last 3 versions'
        ]
      },
      all: {
        src: 'tmp/*.css'
      }
    },

    aws: grunt.file.readJSON('s3.json'),
    aws_s3: {
      options: {
        accessKeyId: '<%= aws.AWS_ACCESS_KEY_ID %>',
        secretAccessKey: '<%= aws.AWS_SECRET_ACCESS_KEY %>',
        region: '<%= aws.AWS_S3_REGION %>',
        uploadConcurrency: 4
      },
      dev: {
        options: {
          bucket: '<%= aws.AWS_DEV_BUCKET %>'
        },
        files: [{expand: true, src: [
          'build/linksf**', 'index.html', 'admin.html', 'vendor/font/**', 'img/**'
        ]}
      },
      prod: {
        options: {
          bucket: '<%= aws.AWS_PROD_BUCKET %>'
        },
        files: [{expand: true, src: [
          'build/linksf**', 'index.html', 'admin.html', 'vendor/font/**', 'img/**'
        ]}
      }
    }
  });

  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-sass');
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-simple-mocha');
  grunt.loadNpmTasks('grunt-cachebuster');
  grunt.loadNpmTasks('grunt-browserify');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-qunit');
  grunt.loadNpmTasks('grunt-env');
  grunt.loadNpmTasks('grunt-autoprefixer');
  grunt.loadNpmTasks('grunt-aws-s3');
  grunt.loadTasks('tasks');

  grunt.registerTask('build:prereqs', [
    'clean',
    'jshint',
    'simplemocha',
    'tokens'
  ]);

  grunt.registerTask('build:dev', [
    'env:dev',
    'build:prereqs',
    'sass',
    'browserify',
    'concat:app',
    'concat:admin',
    'autoprefixer',
    'cachebuster',
    'qunit'
  ]);

  grunt.registerTask('build:production', [
    'env:prod',
    'build:prereqs',
    'sass',
    'cssmin',
    'browserify',
    'uglify',
    'concat:app_min',
    'concat:admin_min',
    'autoprefixer',
    'cachebuster',
    'qunit'
  ]);

  grunt.registerTask('default', 'build:dev');

  grunt.registerTask('deploy:dev', [
    'build:dev',
    'aws_s3:dev'
  ]);

  grunt.registerTask('deploy:prod', [
    'build:prod',
    'aws_s3:prod'
  ]);
};

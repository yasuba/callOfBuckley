/*jshint camelcase: false */

module.exports = function(grunt) {

    'use strict';

    // Load grunt tasks automatically
    require('load-grunt-tasks')(grunt);


    // Configurable paths
    var config = {
        app: 'app',
        dist: 'dist',
        test: 'test',
    };

    grunt.initConfig({

        config: config,

        'bower-install-simple': {
            prod: {
                options: {
                    production: true
                }
            },
            dev: {
                options: {
                    production: false
                }
            }
        },

        concurrent: {
            server: [
                'sass:dev',
            ]
        },

        sass: {
            dev: {
                files: [{
                    expand: true,
                    cwd: '<%= config.app %>/styles/scss',
                    src: ['*.scss'],
                    dest: '<%= config.dist %>/styles',
                    ext: '.css'
                }]
            }
        },


        browserify: {
            options: {
                debug: true
            },
            dev: {
                src: 'app/scripts/main.js',
                dest: 'dist/scripts/main.js'
            }
        },

        browserSync: {
            dev: {
                bsFiles: {
                    src : [
                        '<%= config.app %>/styles/scss/**',
                        '<%= config.app %>/scripts/**',
                        '<%= config.dist %>/*.html',
                    ]
                },
                options: {
                    watchTask: true,
                    server: {
                        baseDir: "<%= config.dist %>",
                        routes: {
                            "/bower_components": "./bower_components"
                        }
                    }
                }
            }
        },

        watch: {
            bower: {
                files: ['bower.json']
            },
            gruntfile: {
                files: ['Gruntfile.js']
            },
            sass: {
                files: ['<%= config.app %>/styles/**/*.{scss,sass}'],
                tasks: ['sass:dev']
            },
            browserify: {
                files: ['<%= config.app %>/scripts/*.js'],
                tasks: ['browserify:dev']
            }
        }
    });

    grunt.registerTask('serve', function(target) {

        grunt.task.run([
            'browserify:dev',
            'concurrent:server',
            'browserSync',
            'watch',
        ]);
    });

    grunt.registerTask('default', [
        'bower-install-simple:dev',
        'concurrent:server'
    ]);
};
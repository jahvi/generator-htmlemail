module.exports = function (grunt) {
    'use strict';

    var path = require('path');

    // Project configuration.
    grunt.initConfig({

        pkg: grunt.file.readJSON('package.json'),

        /**
         * Project Paths Configuration
         * ===============================
         */
        paths: {
            //images folder name
            images: 'img',
            //where to store built files
            dist: 'dist',
            //sources
            src: 'app',
            //main email file
            email: 'index.html',
            //enter here yout production domain
            distDomain: '<%= domainProduction %>',
            //this is the default development domain
            devDomain: 'http://<%%= connect.options.hostname %>:<%%= connect.options.port %>/'
        },

        /**
         * SCSS Compilation Tasks
         * ===============================
         */
        compass: {
            options: {
                sassDir: '<%%= paths.src %>/scss',
                outputStyle: 'expanded',
                httpImagesPath: '/img/'
            },
            dev: {
                options: {
                    cssDir: '<%%= paths.src %>/css',
                    imagesDir: '<%%= paths.src %>/<%%= paths.images %>',
                    noLineComments: false
                }
            },
            dist: {
                options: {
                    force: true,
                    cssDir: '<%%= paths.dist %>/css',
                    imagesDir: '<%%= paths.dist %>/<%%= paths.images %>',
                    noLineComments: true,
                    assetCacheBuster: false
                }
            }
        },

        /**
         * Watch Task
         * ===============================
         */
        watch: {
            compass: {
                files: ['<%%= paths.src %>/scss/**/*.scss'],
                tasks: ['compass:dev']
            },
            livereload: {
                options: {
                    livereload: '<%%= connect.options.livereload %>'
                },
                files: [
                    '<%%= paths.src %>/<%%= paths.email %>',
                    '<%%= paths.src %>/css/{,*/}*.css',
                    '<%%= paths.src %>/<%%= paths.images %>/{,*/}*.{png,jpg,jpeg,gif}'
                ]
            }
        },

        /**
         * Server Tasks
         * ===============================
         */
        connect: {
            options: {
                open: true,
                hostname: 'localhost',
                port: 8000,
                livereload: 35729
            },
            dev: {
                options: {
                    base: '<%%= paths.src %>'
                }
            },
            dist: {
                options: {
                    keepalive: true,
                    livereload: false,
                    base: '<%%= paths.dist %>'
                }
            }
        },

        /**
         * Cleanup Tasks
         * ===============================
         */
        clean: {
            dist: ['<%%= paths.dist %>']
        },

        /**
         * Images Optimization Tasks
         * ===============================
         */
        imagemin: {
            dist: {
                files: [{
                    expand: true,
                    cwd: '<%%= paths.src %>/<%%= paths.images %>',
                    src: '{,*/}*.{png,jpg,jpeg}',
                    dest: '<%%= paths.dist %>/<%%= paths.images %>'
                }]
            }
        },

        /**
         * Copy gif files Tasks
         * ===============================
         */
        copy: {
            gif: {
                files: [{
                    expand: true,
                    cwd: '<%%= paths.src %>/<%%= paths.images %>',
                    src: ['{,*/}*.gif'],
                    dest: '<%%= paths.dist %>/<%%= paths.images %>'
                }]
            }
        },

        /**
         * Premailer Parser Tasks
         * ===============================
         */
        premailer: {
            dist: {
                //source file path
                src: '<%%= paths.src %>/<%%= paths.email %>',
                // overwrite source file
                dest: '<%%= paths.dist %>/<%%= paths.email %>',
                options: {
                    //accepts any premailer command line option
                    //replace mid dashes `-` with camelCase
                    //ie: --base-url => baseUrl
                    //see https://github.com/alexdunae/premailer/wiki/Premailer-Command-Line-Usage
                    baseUrl: '<%%= paths.distDomain %>'
                }
            }
        },

        /**
         * Test Mailer Tasks
         * ===============================
         */
        emailSend: {
            options: {
                /**
                 * Defaults to sendmail
                 * Here follows a Gmail SMTP example trasport
                 * @see https://github.com/andris9/Nodemailer
                 */
                transport: {
                    type: 'SMTP',
                    service: '<%= emailService %>',
                    auth: {
                        user: '<%= emailAuthUser %>',
                        pass: '<%= emailAuthPassword %>'
                    }
                },
                // HTML and TXT email
                // A collection of recipients
                recipients: [
                    {
                        name: '<%= emailRecipientName %>',
                        email: '<%= emailRecipientEmail %>'
                    }
                ]
            },
            dist: {
                src: ['<%%= paths.dist %>/<%%= paths.email %>', '<%%= paths.dist %>/email.txt']
            }
        }

    });

    [
        'grunt-contrib-connect',
        'grunt-contrib-watch',
        'grunt-contrib-compass',
        'grunt-contrib-imagemin',
        'grunt-contrib-copy',
        'grunt-contrib-clean',
    ].forEach(grunt.loadNpmTasks);

    grunt.loadTasks(path.normalize(__dirname + '/vendor/tasks'));

    // Rename "send" task so we can use the name to run
    // all required dist tasks before sending the test email
    grunt.renameTask('send', 'emailSend');

    grunt.registerTask('default', 'dev');

    grunt.registerTask('dev', [
        'compass:dev',
        'connect:dev',
        'watch'
    ]);

    grunt.registerTask('dist', [
        'clean',
        'imagemin',
        'copy',
        'compass:dist',
        'premailer:dist',
        'connect:dist'
    ]);

    grunt.registerTask('send', [
        'clean',
        'imagemin',
        'copy',
        'compass:dist',
        'premailer:dist',
        'emailSend'
    ]);

};

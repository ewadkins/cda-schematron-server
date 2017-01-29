// jshint node:true
module.exports = function (grunt) {

    grunt.initConfig({
        jshint: {
            options: {
                jshintrc: '.jshintrc',
                reporter: require('jshint-stylish')
            },
            files: {
                src: [
                    '*.js',
                    'routes/**/*.js',
                    'validator/**/*.js',
                    'test/**/*.js',
                ]
            }
        },
        mochaTest: {
            api: {
                options: {
                    reporter: 'spec'
                },
                src: ['test/api.js']
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-mocha-test');
    
    grunt.registerTask('default', ['jshint', 'mochaTest']);
    grunt.registerTask('jshint', ['jshint']);
    grunt.registerTask('api', ['mochaTest']);

};


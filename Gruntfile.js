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
                ]
            }
        },
    });

    grunt.loadNpmTasks('grunt-contrib-jshint');
    
    grunt.registerTask('default', [ 'jshint' ]);

};


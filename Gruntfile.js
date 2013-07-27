module.exports = function(grunt) {

    grunt.initConfig({
        pkg: grunt.file.readJSON('package.json'),

        uglify: {
            options: {
                banner: '' +
                '/*  <%= pkg.name %>\n' +
                '    <%= pkg.website %>\n' +
                '    <%= pkg.author.name %> | ' +
                    '<%= pkg.author.email %> | ' +
                    '<%= pkg.author.website %>\n' +
                '    <%= grunt.template.today("dd-mm-yyyy") %> */\n'
            },
            dist: {
                files: { '<%= pkg.name %>.min.js': ['<%= pkg.name %>.js'] }
            }
        },

        qunit: {
            files: ['test/index.html']
        },

        jshint: {
            files: ['jsmessage.js', 'test/jsmessageTest.js'],
            options: {
                globals: {
                    jQuery: true,
                    console: true,
                    module: true,
                    document: true
                }
            }
        }
    });

    grunt.loadNpmTasks('grunt-contrib-uglify');
    //grunt.loadNpmTasks('grunt-contrib-jshint');
    grunt.loadNpmTasks('grunt-contrib-qunit');

    //grunt.registerTask('default', ['jshint']);
    grunt.registerTask('default', ['qunit', 'uglify']);
};

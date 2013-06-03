/*global module:false require*/
module.exports = function(grunt) {

  // Project configuration.
  grunt.initConfig({
    pkg: grunt.file.readJSON('package.json'),

    files: {
      grunt: ['gruntfile.js'],
      js:    ['js/*.js', 'js/**/*.js'],
      css:   ['css/*.css'],
      styl:  ['peel.styl']
    },

    jshint: {
      files: ['<%= files.grunt %>', '<%= files.js %>'],

      options: {
        jquery: true,
        smarttabs: true,
        curly: true,
        eqeqeq: true,
        immed: true,
        latedef: true,
        newcap: true,
        noarg: true,
        sub: true,
        undef: true,
        boss: true,
        eqnull: true,
        browser: true
      },

      globals: {
        jQuery: true,
        Modernizr: true,
        console: true,
        undef: true,
        unused: false
      }
    },

    cssmin: {
      dist: {
        src: ['css/libs/z.styles.concat.css'],
        dest: 'css/min/styles.min.css'
      }
    },

    csslint: {
      styles: {
        src: ['<%= files.css %>'],
        options: {
          // 'import': false,
          'ids': false,
          'font-sizes': false,
          'unqualified-attributes': false,
          'floats': false,
          'overqualified-elements': false,
          'adjoining-classes': false,
          'important': false,
          'box-sizing': false,
          'unique-headings': false,
          'qualified-headings': false,
          'regex-selectors': false,
          'universal-selector': false,
          'duplicate-properties': false,
          'duplicate-background-images': false,
          'box-model': false,
          'outline-none': false,
          'text-indent': false,
          'compatible-vendor-prefixes': false,
          'star-property-hack': false,
          'display-property-grouping': false,
          'underscore-property-hack': false
        }
      }
    },

    grunticon: {
      options: {
        src: 'css/custom/svg',
        dest: 'css/min/svg'
      }
    },

    svgo: {
      optimize: {
        files: 'css/min/svg/*.svg'
      }
    },

    stylus: {
      styles: {
        files: {
          'css/libs/zz.styl.css': ['<%= files.styl %>']
        }
      }
    },

    clean: {
      build: {
        src: ['css/processed']
      }
    },

    watch: {
      files: ['<%= files.grunt %>', '<%= files.js %>', '<%= files.css %>', '<%= files.styl %>'],
      tasks: ['default']
    }
  });


  // load plugins installed from npm (see package.json)
  grunt.loadNpmTasks('grunt-contrib-concat');
  grunt.loadNpmTasks('grunt-contrib-clean');
  grunt.loadNpmTasks('grunt-contrib-jshint');
  grunt.loadNpmTasks('grunt-contrib-watch');
  grunt.loadNpmTasks('grunt-contrib-uglify');
  grunt.loadNpmTasks('grunt-contrib-csslint');
  grunt.loadNpmTasks('grunt-contrib-cssmin');
  grunt.loadNpmTasks('grunt-smushit');

  grunt.loadNpmTasks('grunt-contrib-stylus');

  grunt.loadNpmTasks('grunt-grunticon');
  grunt.loadNpmTasks('svgo-grunt');


  /**
   * Default task
   *
   * Lets break it down.
   *   lint custom JS in /custom/
   *   concat custom JS into /libs/
   *   concat custom and non-minified JS libraries/plugins in /libs/
   *   minify concatenated JS in /libs/ to /min/
   *   concat all minified JS in /min/
   * Then repeat for CSS.
   *
   * As a result
   *   pathing will be maintained by the flat structure
   *   development code will live in concatenated /libs/scripts.js and /libs/styles.css
   *   production code will live in minified /min/scripts.min.js and /min/styles.min.css
   */
  // grunt.registerTask('default', 'lint concat:js concat:jslibs min concat:jsmin   csslint concat:css concat:csslibs cssmin concat:cssmin');
  grunt.registerTask('default', [
                      // process js
                      'jshint',        // lint js

                      // process css
                      'stylus',         // process styl files and save to /libs/z.sass.css
                      'csslint',        // lint css for errors
                      'concat:css',     // concatenate css files in /custom/ to /libs/z.concat.css
                      'concat:csslibs', // concatenate css files in /libs/ to /libs/z.concat.css (overwriting the file)
                      'cssmin',         // minify /libs/z.concat.css to /min/styles.min.css
                      'concat:cssmin'   // concatenate css files in /min/ to /min/styles.min.css (overwriting the file)
                    ]);


  /**
   * Cleanup task
   *
   * Remove the processed Sass CSS files then run the default task
   */
  grunt.registerTask('cleanup', ['clean','default']);


  /**
   * Minify task
   *
   * Run the default task then losslessly minify images with Yahoo!'s Smush-It
   */
  grunt.registerTask('minify', ['default', 'smushit']);


  /**
   * Icons task
   *
   * Build icon fallbacks. Optimize SVG.
   */
  grunt.registerTask('icons', ['grunticon', 'svgo']);
};
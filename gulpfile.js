'use strict';

// Include Gulp & Tools We'll Use
var gulp = require('gulp');
var $ = require('gulp-load-plugins')();
var del = require('del');
var runSequence = require('run-sequence');
var merge = require('merge-stream');
var path = require('path');
var fs = require('fs');
var glob = require('glob');
var minimist = require('minimist');

var knownOptions = {
  string: 'env',
  default: {
    env: process.env.NODE_ENV || 'production'
  }
};

var options = minimist(process.argv.slice(2), knownOptions);

gulp.task('deploy:remote', function() {
  var location = 'current';
  if (options.version) {
    location = options.version;
  }
  var s3 = require('gulp-s3-upload')({
    region: 'us-west-2'
  });
  return gulp.src(
        [
            'components/cloudstitch-*/**',
            'components/iron-component-page*/**',
            'components/webcomponentsjs*/**',
            'components/polymer*/**',
            'components/hydrolysis*/**',
            'components/iron-doc-viewer*/**',
            'components/iron-doc-viewer*/**',
            'components/iron-flex-layout*/**',
            'components/iron-ajax*/**',
            'components/iron-icons*/**',
            'components/iron-icon*/**',
            'components/iron-a11*/**',
            'components/iron-behaviors*/**',
            'components/marked-element*/**',
            'components/paper-button*/**',
            'components/prism-element*/**',
            'components/promise-polyfill*/**',
            'components/iron-meta*/**',
            'components/font-roboto*/**',
            'components/iron-selector*/**',
            'components/paper-material*/**',
            'components/paper-ripple*/**',
            'components/paper-behaviors*/**',
            'components/marked*/**',
            'components/prism*/**',
            'components/paper-header-panel*/**',
            'components/paper-styles*/**',
            'components/paper-toolbar*/**',
            'index.html'
        ],
        {
        }
  )
  .pipe(s3({
      Bucket: 'components.cloudstitch.com', //  Required
        ACL:    'public-read',
      keyTransform: function(relative_filename) {
        if (relative_filename != 'index.html') {
          return 'components/' + relative_filename;
        }
        return relative_filename;
      }

  }));
});
'use strict';

var gulp = require('gulp');
var shell = require('gulp-shell');
var inquirer = require('inquirer');

gulp.task('git-show', shell.task([
  'git show -1'
]));

gulp.task('git-push', shell.task([
  'git push',
  'git push --tags'
]));

gulp.task('git-push:confirm', ['git-show'], function(done) {
  inquirer.prompt([{
    type: 'confirm',
    message: 'Push version?',
    default: false,
    name: 'push'
  }], function(answers) {
    if(answers.push) {
      gulp.start('git-push');
    }
    done();
  });
});

gulp.task('release', ['git-push:confirm']);

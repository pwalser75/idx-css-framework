'use strict';

const gulp = require('gulp');
const del = require('del');
const merge = require('merge-stream');
const mocha = require('gulp-mocha');
const concat = require('gulp-concat');
const sass = require('gulp-sass');
const cssPrefixer = require('gulp-autoprefixer');
const cssMinify = require('gulp-cssnano');
const runSequence = require('run-sequence');
const cssConcat = require('gulp-concat-css');

const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();
const url = require('url');
const proxy = require('proxy-middleware');

// Configuration

const config = {
	source: './src',
	target: './build',
	css: {
		target: 'idx-style-min.css'
	},
	filetypes: {
		stylesheet: ['css', 'scss'],
		resources:  ['html','json','jpg','png','svg','woff','woff2']
	}
};

// Build functions

function fileTypeMatcher(fileSuffixArray) {
	return fileSuffixArray.map(type=> config.source+'/**/*.'+type);
}

gulp.task('compile-stylesheets', () => {
	return gulp.src(fileTypeMatcher(config.filetypes.stylesheet))
		.pipe(sass(({
            precision: 10,
            includePaths: 'node_modules/node-normalize-scss'
        })).on('error', sass.logError))
		.pipe(cssPrefixer())
		.pipe(cssConcat(config.css.target))
		.pipe(gulp.dest(config.target));
});

gulp.task('copy-resources', () => {
	return gulp.src(fileTypeMatcher(config.filetypes.resources))
		.pipe(gulp.dest(config.target));
});

// build targets

gulp.task('clean', () => {
	del(config.target);
});

gulp.task('build', (callback) => {
	 return runSequence('clean', 'compile-stylesheets','copy-resources', 'minify' ,callback);
});

gulp.task('minify', () => {

    return gulp.src(config.target+'/'+config.css.target)
        .pipe(cssMinify())
        .pipe(gulp.dest(config.target));
});

gulp.task('watch', ['build'], () => {
    var watchers = [
		gulp.watch(fileTypeMatcher(config.filetypes.stylesheet), [ 'compile-stylesheets' ]),
		gulp.watch(fileTypeMatcher(config.filetypes.resources), [ 'copy-resources' ])
	];
    var onChanged = function(event) {
		var message='File ' + event.path + ' was ' + event.type + '. Running tasks...';
		console.log(message);
		notify(message);
        browserSync.reload();
	};

	watchers.forEach(w => w.on('change', onChanged));
	watchers.forEach(w => w.on('add', onChanged));
	watchers.forEach(w => w.on('unlink', onChanged));
});

gulp.task('server', ['watch'], () => {

	browserSync.init({
		server: {
			baseDir: config.target
		}
	});
});

gulp.task('default', ['server']);

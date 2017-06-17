'use strict';

const gulp = require('gulp');
const del = require('del');
const sass = require('gulp-sass');
const cssPrefixer = require('gulp-autoprefixer');
const cssMinify = require('gulp-cssnano');
const runSequence = require('run-sequence');
const cssConcat = require('gulp-concat-css');

const plumber = require('gulp-plumber');
const notify = require('gulp-notify');
const browserSync = require('browser-sync').create();

// Configuration

const config = {
	projectName: 'IDX CSS Framework',
	source: './src',
	target: './build',
	css: {
		target: 'idx-style-min.css'
	},
	filetypes: {
		stylesheet: ['scss'],
		resources:  ['html','css','js','json','jpg','png','svg','woff','woff2']
	}
};

// Build functions

function fileTypeMatcher(fileSuffixArray) {
	return fileSuffixArray.map(type=> config.source+'/**/*.'+type);
}

function compileStylesheets() {
	return gulp.src(fileTypeMatcher(config.filetypes.stylesheet))
		.pipe(plumber({
			errorHandler: notify.onError('Error: <%= error.message %>')
		}))
		.pipe(sass(({
            precision: 10,
            includePaths: 'node_modules/node-normalize-scss'
        })).on('error', sass.logError))
		.pipe(cssPrefixer())
		.pipe(cssConcat(config.css.target))
		.pipe(gulp.dest(config.target));
}

function copyResources() {
	return gulp.src(fileTypeMatcher(config.filetypes.resources))
		.pipe(gulp.dest(config.target));
}

gulp.task('compile-stylesheets', () => {
	return compileStylesheets();
});

gulp.task('copy-resources', () => {
	return copyResources();
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
	
	var sync = (stream, message) => {
		return stream
		.pipe(browserSync.stream());
	}
	
	gulp.watch(fileTypeMatcher(config.filetypes.stylesheet),
		()=>sync(compileStylesheets(), "Compiled stylesheets"));

	gulp.watch(fileTypeMatcher(config.filetypes.resources),
		()=>sync(copyResources(), "Updated resources"));
});

gulp.task('server', ['watch'], () => {

	browserSync.init({
		port : 4000,
		server: {
			baseDir: config.target
		}
	});
});

gulp.task('default', ['server']);

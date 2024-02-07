const {src, dest, watch, parallel}= require("gulp");
const sass = require("gulp-sass")(require('sass'));
const plumber = require("gulp-plumber");
const autoprefixer = require("autoprefixer");
const cssnano = require("cssnano");
const postcss = require("gulp-postcss");
const sourcemaps = require("gulp-sourcemaps");
const webp = require("gulp-webp");
const cache = require('gulp-cache');
const imagemin = require('gulp-imagemin');
const avif = require('gulp-avif');

//Javascript
const terser = require("gulp-terser-js");

function css(done){
    
    src("src/scss/**/*.scss")//identificar el archivo de sass
        .pipe(sourcemaps.init())
        .pipe(plumber())
        .pipe(sass())//compilarlo
        .pipe(postcss([autoprefixer(), cssnano()]))
        .pipe(sourcemaps.write('.'))
        .pipe(dest("build/css"));//guardarlo localmente
    
    
    done();
}

function imagenes(done){
    const opciones ={
        optimizationLevel: 3
    };
    src('img/**/*.{jpg, png}')
        .pipe(cache(imagemin(opciones)))
        .pipe(dest('build/img'))
    done();
}

function versionwebp(done){
    const opciones ={
        quality: 50
    };
    src('img/**/*.{jpg, png}')
        .pipe(webp(opciones))
        .pipe(dest('build/img'))
    done();
}

function versionavif(done){
    const opciones ={
        quality: 50
    };
    src('img/**/*.{jpg, png}')
        .pipe(avif(opciones))
        .pipe(dest('build/img'))
    done();
}

function javascript(done){
    src('src/js/**/*.js')
        .pipe(sourcemaps.init())
        .pipe(terser())
        .pipe(sourcemaps.write('.'))
        .pipe(dest('build/js'));

    done();
}

function dev(done){
    watch("src/scss/**/*.scss", css);
    watch("src/js/**/*.js", javascript);
    done();
}

exports.css = css;
exports.js = javascript;
exports.imagenes = imagenes;
exports.versionwebp = versionwebp;
exports.versionavif = versionavif;
exports.dev = parallel(imagenes, versionavif, versionwebp, javascript, dev);

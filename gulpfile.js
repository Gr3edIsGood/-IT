

let project_folder="dist";
let source_folder="src";


let path={

	build:{
		html: project_folder + "/",
		css: project_folder + "/css/",
		img: project_folder + "/img/",
	},

	source:{
		html: source_folder + "/*.html",
		css: source_folder + "/scss/style.scss",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
	},

	watch:{
		html: source_folder + "/**/*.html",
		css: source_folder + "/scss/**/*.scss",
		img: source_folder + "/img/**/*.+(png|jpg|gif|ico|svg|webp)",
	},

	clean: "./" + project_folder + "/"
	

}

let { src, dest } = require('gulp'),
 gulp = require('gulp'),
 browsersync = require('browser-sync').create(),
 del = require('del'),
 scss = require('gulp-sass'),
 autoprefixer = require('gulp-autoprefixer'),
 clean_css = require('gulp-clean-css'),
 rename = require('gulp-rename'),
 imagemin = require('gulp-imagemin');

 function browserSync(params) {
 	browsersync.init({
 		server:{
 			baseDir: "./" + project_folder + "/"
 		},
 		port:3000,
 		notify:false
 	})
 }

function html(){
 	return src(path.source.html)
 	 .pipe(dest(path.build.html))
 	 .pipe(browsersync.stream())
}

function css(){
	return src(path.source.css)
	 .pipe(
	 	scss({
	 		outputStyle: "expanded"
	 	})
	 )
	 .pipe(
	 	autoprefixer({
	 		overrideBrowserslist: ["last 4 versions"],
	 		cascade: true
	 	})
	 )
	 .pipe(dest(path.build.css))
	 .pipe(clean_css())
	 .pipe(
	 	rename({
	 		extname: ".min.css"
	 	})
	 )
 	 .pipe(dest(path.build.css))
 	 .pipe(browsersync.stream())
}

function images(){
 	return src(path.source.img)
 	 .pipe(
 	 	imagemin({
 	 		progressive:true,
 	 		svgoPlugins: [{removeVievBox: false}],
 	 		interlaced:true,
 	 		optimizationLevel:3
 	 	})
 	 )
 	 .pipe(dest(path.build.img))
 	 .pipe(browsersync.stream())
}


function watchFiles(params){
 	gulp.watch([path.watch.html], html);
 	gulp.watch([path.watch.css], css);
 	gulp.watch([path.watch.img], images);
}



function clean(params){
 	return del(path.clean);
 }





 let build = gulp.series(clean, gulp.parallel(css, html, images));
 let watch = gulp.parallel(build, watchFiles, browserSync);

 exports.images = images;
 exports.css = css;
 exports.html = build;
 exports.build = build;
 exports.watch = watch;
 exports.default = watch;
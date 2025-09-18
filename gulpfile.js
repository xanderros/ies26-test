const gulp = require("gulp");
const sass = require("gulp-sass")(require("sass"));
const cleanCSS = require("gulp-clean-css");
const concat = require("gulp-concat");
const webpack = require("webpack-stream");
const browserSync = require("browser-sync").create();
const nunjucksRender = require("gulp-nunjucks-render");
const del = require("del");
const sourcemaps = require("gulp-sourcemaps");
const plumber = require("gulp-plumber");
const notify = require("gulp-notify");
const svgmin = require("gulp-svgmin");
const fs = require("fs");
const path = require("path");

// Environment detection
const isProduction = process.env.NODE_ENV === "production";

// SVG helpers functions
const svgCache = new Map();

function inlineSvgIcon(iconPath) {
  // Check cache
  if (svgCache.has(iconPath)) {
    return svgCache.get(iconPath);
  }

  const fullPath = path.join(__dirname, "src/assets/icons", iconPath);

  try {
    if (fs.existsSync(fullPath)) {
      const svgContent = fs.readFileSync(fullPath, "utf8");
      // Remove extra spaces and line breaks
      const optimizedSvg = svgContent.trim();
      svgCache.set(iconPath, optimizedSvg);
      return optimizedSvg;
    } else {
      console.warn(`SVG icon not found: ${fullPath}`);
      return "";
    }
  } catch (error) {
    console.error(`Error reading SVG icon ${iconPath}:`, error);
    return "";
  }
}

function getSvgIconPath(iconPath) {
  return path.join("src/assets/icons", iconPath);
}

// Paths
const paths = {
  styles: {
    src: "src/styles/main.scss",
    watch: "src/styles/**/*.scss",
    critical: "src/styles/critical.scss",
    dest: "public/css",
  },
  scripts: {
    src: "src/scripts/main.js",
    watch: "src/scripts/**/*.js",
    dest: "public/js",
  },
  templates: {
    src: "src/pages/**/*.njk",
    watch: "src/**/*.njk",
    dest: "public",
  },
  images: {
    src: "src/assets/img/**/*",
    dest: "public/assets/img",
  },
  icons: {
    src: "src/assets/icons/*.svg",
    dest: "public/assets/icons",
  },
  favicon: {
    src: "src/assets/favicon/*",
    dest: "public/assets/favicon",
  },
  fonts: {
    src: "src/assets/fonts/**/*",
    dest: "public/assets/fonts",
  },
  videos: {
    src: "src/assets/video/*.{mp4,webp,webm}",
    dest: "public/assets/video",
  },
};

// Clean public folder
function clean() {
  return del(["public/**", "!public"]);
}

// Clean source maps specifically for production
function cleanSourceMaps() {
  if (isProduction) {
    return del(["public/css/*.map", "public/js/*.map"]);
  }
  return Promise.resolve();
}

// Process critical CSS
function criticalCSS() {
  let stream = gulp.src(paths.styles.critical).pipe(
    plumber({
      errorHandler: notify.onError((error) => ({
        title: "Critical CSS",
        message: error.message,
      })),
    })
  );

  // Only initialize source maps in development
  if (!isProduction) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(sass());

  if (isProduction) {
    stream = stream.pipe(cleanCSS());
  }

  // Only write source maps in development
  if (!isProduction) {
    stream = stream.pipe(sourcemaps.write("."));
  }

  stream = stream.pipe(gulp.dest(paths.styles.dest)).pipe(browserSync.stream());

  return stream;
}

// Process main styles
function styles() {
  let stream = gulp.src(paths.styles.src).pipe(
    plumber({
      errorHandler: notify.onError((error) => ({
        title: "Styles",
        message: error.message,
      })),
    })
  );

  // Only initialize source maps in development
  if (!isProduction) {
    stream = stream.pipe(sourcemaps.init());
  }

  stream = stream.pipe(sass()).pipe(concat("style.css"));

  if (isProduction) {
    stream = stream.pipe(cleanCSS());
  }

  // Only write source maps in development
  if (!isProduction) {
    stream = stream.pipe(sourcemaps.write("."));
  }

  stream = stream.pipe(gulp.dest(paths.styles.dest)).pipe(browserSync.stream());

  return stream;
}

// Process templates (without critical CSS inline)
function templates() {
  return gulp
    .src(paths.templates.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "Templates",
          message: error.message,
        })),
      })
    )
    .pipe(
      nunjucksRender({
        path: ["src/components", "src/layouts"],
        data: {
          svgIcon: inlineSvgIcon,
          svgIconPath: getSvgIconPath,
        },
      })
    )
    .pipe(gulp.dest(paths.templates.dest))
    .pipe(browserSync.stream());
}

// Inline critical CSS into templates
function inlineCriticalCSS() {
  const criticalCSSPath = path.join(__dirname, "public/css/critical.css");

  if (fs.existsSync(criticalCSSPath)) {
    const criticalCSS = fs.readFileSync(criticalCSSPath, "utf8");

    return gulp
      .src(paths.templates.src)
      .pipe(
        plumber({
          errorHandler: notify.onError((error) => ({
            title: "Templates",
            message: error.message,
          })),
        })
      )
      .pipe(
        nunjucksRender({
          path: ["src/components", "src/layouts"],
          data: {
            criticalCSS: criticalCSS,
            svgIcon: inlineSvgIcon,
            svgIconPath: getSvgIconPath,
          },
        })
      )
      .pipe(gulp.dest(paths.templates.dest))
      .pipe(browserSync.stream());
  } else {
    console.log("Critical CSS file not found, skipping inline...");
    return gulp.src(paths.templates.src);
  }
}

// Process scripts
function scripts() {
  return gulp
    .src("src/scripts/main.js")
    .pipe(plumber())
    .pipe(webpack(require("./webpack.config.js")))
    .pipe(gulp.dest(paths.scripts.dest))
    .pipe(browserSync.stream());
}

// Copy images without changes
function images() {
  return gulp
    .src(paths.images.src, { buffer: true })
    .pipe(gulp.dest(paths.images.dest));
}

// Copy fonts
function fonts() {
  return gulp.src(paths.fonts.src).pipe(gulp.dest(paths.fonts.dest));
}

// Copy favicon
function favicon() {
  return gulp.src(paths.favicon.src).pipe(gulp.dest(paths.favicon.dest));
}

// Copy videos
function videos() {
  return gulp.src(paths.videos.src).pipe(gulp.dest(paths.videos.dest));
}

// Optimize SVG icons
function optimizeIcons() {
  return gulp
    .src(paths.icons.src)
    .pipe(
      plumber({
        errorHandler: notify.onError((error) => ({
          title: "SVG Icons",
          message: error.message,
        })),
      })
    )
    .pipe(
      svgmin({
        plugins: [
          {
            name: "preset-default",
            params: {
              overrides: {
                removeViewBox: false,
                removeTitle: false,
              },
            },
          },
          "removeDimensions",
        ],
      })
    )
    .pipe(gulp.dest(paths.icons.dest))
    .pipe(browserSync.stream());
}

// Development server
function serve() {
  browserSync.init({
    server: {
      baseDir: "./public",
    },
    port: 3001,
    open: true,
    notify: false,
  });

  // Watch files
  gulp.watch(
    paths.styles.watch,
    gulp.series(styles, criticalCSS, inlineCriticalCSS)
  );
  gulp.watch(paths.scripts.watch, scripts);
  gulp.watch(paths.templates.watch, inlineCriticalCSS);
  gulp.watch(paths.images.src, images);
  gulp.watch(paths.icons.src, optimizeIcons);
  gulp.watch(paths.videos.src, videos);
}

// Build for production
function buildProduction(done) {
  process.env.NODE_ENV = "production";
  gulp.series(
    clean,
    gulp.parallel(
      criticalCSS,
      styles,
      scripts,
      templates,
      images,
      fonts,
      favicon,
      videos,
      optimizeIcons
    ),
    inlineCriticalCSS,
    cleanSourceMaps
  )(done);
}

// Build for development
function buildDevelopment(done) {
  process.env.NODE_ENV = "development";
  gulp.series(
    clean,
    gulp.parallel(
      criticalCSS,
      styles,
      scripts,
      templates,
      images,
      fonts,
      favicon,
      videos,
      optimizeIcons
    ),
    inlineCriticalCSS
  )(done);
}

// Development server
function dev(done) {
  process.env.NODE_ENV = "development";
  gulp.series(
    clean,
    gulp.parallel(
      criticalCSS,
      styles,
      scripts,
      templates,
      images,
      fonts,
      favicon,
      videos,
      optimizeIcons
    ),
    inlineCriticalCSS,
    serve
  )(done);
}

// Export tasks
exports.clean = clean;
exports.cleanSourceMaps = cleanSourceMaps;
exports.criticalCSS = criticalCSS;
exports.styles = styles;
exports.scripts = scripts;
exports.templates = templates;
exports.inlineCriticalCSS = inlineCriticalCSS;
exports.images = images;
exports.fonts = fonts;
exports.favicon = favicon;
exports.videos = videos;
exports.optimizeIcons = optimizeIcons;
exports.build = buildProduction;
exports.dev = dev;
exports.default = dev;

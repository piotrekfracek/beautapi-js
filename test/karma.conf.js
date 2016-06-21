module.exports = function(config) {
  config.set({
    browsers:          ["PhantomJS", "Chrome", "Safari", "Opera", "Firefox"],
    frameworks:        ["browserify", "jasmine"],
    reporters:         ["dots"],
    singleRun:         true,
    basePath:          "../",
    autoWatch:         false,

    captureTimeout: 60000,
    browserDisconnectTimeout: 10000,
    browserDisconnectTolerance: 1,
    browserNoActivityTimeout: 60000,

    files: [
      "./node_modules/phantomjs-polyfill/bind-polyfill.js",
      "test/src/api.withBackend.test.js",
      "test/**/*.test.js"
    ],

    plugins: [
      "karma-phantomjs-launcher",
      "karma-chrome-launcher",
      "karma-firefox-launcher",
      "karma-safari-launcher",
      "karma-opera-launcher",
      "karma-jasmine",
      "karma-browserify"
    ],

    preprocessors: {
      'test/**/*.js': ['browserify']
    },

    browserify: {
      transform: ['babelify'],
      extensions: ['.js']
    }
  });
};

module.exports = {
  server: {
    baseDir: './',
    middleware: {
      1: require('connect-history-api-fallback')({index: '/src/devel.html'})
    }
  }
};

module.exports = {
  publicPath: '/',
  chainWebpack: config => {
    config
      .plugin("html")
      .tap(args => {
        args[0].template = './index.html'
        return args
      })
  }
};
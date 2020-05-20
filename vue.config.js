module.exports = {
  //OneMapWebTools 环境
  // baseUrl: process.env.NODE_ENV === 'production' ? '/zentao/onemaptools/' : '/'  

  //项目管理 环境
  publicPath: process.env.NODE_ENV === 'production' ? '/onemaptools/' : '/',
  devServer: {
    port: 8081, // 端口
  },
}
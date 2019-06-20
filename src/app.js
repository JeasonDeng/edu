import express from 'express'
import config from './config'
import nunjucks from 'nunjucks'
import bodyParser from 'body-parser'
import indexRouter from './routes/index'
import advertRouter from './routes/advert'

const app = express()

app.use('/node_modules', express.static(config.node_modules_path))
app.use('/public', express.static(config.publicPath))

// parse application/x-www-form-urlencoded
app.use(bodyParser.urlencoded({ extended: false }))
// parse application/json
app.use(bodyParser.json())

// 配置 nunjucks 模版引擎
nunjucks.configure(config.viewPath, {
  autoescape: true,
  express: app,
  noCache: true
})

// 将路有挂载到 app 上
app.use(indexRouter)
app.use(advertRouter)

// 全局错误处理
app.use((err, req, res, next) => {
  res.json({
    err_code: 500,
    err_message: err.message
  })
})

app.listen(3000, () => {
  console.log('server is running at port 3000...')
})
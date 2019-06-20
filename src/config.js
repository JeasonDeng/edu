import { join } from 'path'

export default {
  viewPath: join(__dirname, '../views'),
  node_modules_path: join(__dirname, '../node_modules'),
  publicPath: join(__dirname, '../public'),
  unloadPath: join(__dirname, '../public/uploads')
}
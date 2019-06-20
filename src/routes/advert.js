import express from 'express'
import Advert from '../models/advert'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'
// 创建路由容器
const router = express.Router()

// 设计路由
router.get('/advert', (req, res, next) => {
  const pageSize = 5
  let currentPage = Number(req.query.page, 10) || 1
  Advert.countDocuments((err, count) => {
    if (err) {
      return next(err)
    }
    const totalPage = Math.ceil(count / pageSize)
    if (currentPage < 1) {
      currentPage = 1
    } else if (currentPage > totalPage) {
      currentPage = totalPage
    }
    Advert
      .find()
      .skip(pageSize * (currentPage - 1))
      .limit(pageSize)
      .exec((err, data) => {
        if (err) {
          return next(err)
        }
        res.render('advert_list.html', { adverts: data, totalPage, currentPage })
      })
  })
})

router.get('/advert/add', (req, res, next) => {
  res.render('advert_add.html')
})






















/**
 * POST 请求 /advert/add
 * body: { title, image, link, start_time, end_time }
 */
router.post('/advert/add', (req, res, next) => {
  // 1.接收客户端提交的数据
  const form = new formidable.IncomingForm()
  form.uploadDir = config.unloadPath
  form.keepExtensions = true
  form.parse(req, function (err, fields, files) {
    if (err) {
      return next(err)
    }
    const body = fields
    body.image = basename(files.image.path)
    // 2.操作数据库
    const advert = new Advert({
      title: body.title,
      image: body.image,
      link: body.link,
      start_time: body.start_time,
      end_time: body.end_time
    })
    advert.save((err, data) => {
      if (err) {
        return next(err)
      }
      // 3.发送响应消息
      res.json({
        err_code: 0
      })
    })
  })

})

/**
 * GET 请求 /advert/list
 */
router.get('/advert/list', (req, res, next) => {
  Advert.find((err, data) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 200,
      data: data
    })
  })
})

/**
 * GET 请求 /advert/desc/:id
 */
router.get('/advert/desc/:id', (req, res, next) => {
  Advert.findById(req.params.id, (err, data) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0,
      data: data
    })
  })
})

/**
 * POST   请求 /advert/edit
 * 更新广告数据
 */
router.post('/advert/edit', (req, res, next) => {
  const body = req.body
  Advert.findById(body.id, (err, data) => {
    if (err) {
      return next(err)
    }
    data.title = body.title
    data.image = body.image
    data.link = body.link
    data.start_time = body.start_time
    data.end_time = body.end_time
    data.last_modified = Date.now()
    data.save((err, data) => {
      if (err) {
        return next(err)
      }
      res.json({
        err_code: 0
      })
    })
  })
})

/**
 * GET 请求
 * 删除广告数据
 */
router.get('/advert/delete/:id', (req, res, next) => {
  Advert.deleteOne({ _id: req.params.id }, err => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0
    })
  })
})
export default router
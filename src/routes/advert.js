import express from 'express'
import Advert from '../models/advert'
import formidable from 'formidable'
import config from '../config'
import { basename } from 'path'
import { rejects } from 'assert';
// 创建路由容器
const router = express.Router()

// 设计路由
router.get('/advert', (req, res, next) => {
  const path = req.path
  res.render('advert_list.html', { path: path })
})
router.get('/advert/list', (req, res, next) => {
  let { page, pageSize } = req.query
  page = parseInt(page)
  pageSize = parseInt(pageSize)
  const result = {}
  Advert
    .find()
    .skip(pageSize * (page - 1))
    .limit(pageSize)
    .then(data => {
      result.adverts = data
      return Advert.countDocuments()
    })
    .then(data => {
      result.err_code = 0
      result.count = data
      res.json(result)
    })
})


router.get('/advert/delete', (req, res, next) => {
  const delId = req.query.id
  Advert.deleteOne({ _id: delId }, (err) => {
    if (err) {
      return next(err)
    }
    res.json({
      err_code: 0
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
  pmformidable(req)
    .then(data => {
      const [fields, files] = data
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
      return advert.save()
    })
    .then(data => {
      res.json({
        err_code: 0
      })
    })
    .catch(err => {
      next(err)
    })

  function pmformidable(req) {
    return new Promise((resolve, reject) => {
      const form = new formidable.IncomingForm()
      form.uploadDir = config.unloadPath
      form.keepExtensions = true
      form.parse(req, function (err, fields, files) {
        if (err) {
          reject(err)
        }
        resolve([fields, files])
      })
    })
  }
})

/**
 * GET 请求 /advert/list
 */
// router.get('/advert/list', (req, res, next) => {
//   Advert.find((err, data) => {
//     if (err) {
//       return next(err)
//     }
//     res.json({
//       err_code: 200,
//       data: data
//     })
//   })
// })

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
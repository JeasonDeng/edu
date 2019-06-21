export function indexRender(req, res, next) {
  const path = req.path
  res.render('index.html', { path: path })
}
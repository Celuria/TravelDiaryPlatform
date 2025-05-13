//文件处理系统
const upload = require('../middlewares/multerMiddleware');

exports.uploadAvatar = upload.single('avatar');
exports.uploadMedia = upload.fields([{ name: 'images', maxCount: 10 }, { name: 'video', maxCount: 1 }]);
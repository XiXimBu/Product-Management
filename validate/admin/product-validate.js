const systemConfig = require('../../config/system')

module.exports.CreatPost = (req, res, next) => {
	if(!req.body.title) {
		req.flash("error", "Tiêu đề sản phẩm không được để trống!")
		res.redirect(`${systemConfig.prefixAdmin}/products/create`)
		return 
	}
	next();
	// nex() là hàm middleware tiếp theo, nếu có lỗi sẽ không gọi next() mà sẽ trả về lỗi ngay lập tức
}
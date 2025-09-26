exports.create = (req, res) => {
  res.send({ message: "Tạo liên hệ mới" });
};

exports.findAll = (req, res) => {
  res.send({ message: "Trả về tất cả liên hệ" });
};

exports.findOne = (req, res) => {
  res.send({ message: `Trả về liên hệ có id = ${req.params.id}` });
};

exports.update = (req, res) => {
  res.send({ message: `Cập nhật liên hệ có id = ${req.params.id}` });
};

exports.delete = (req, res) => {
  res.send({ message: `Xóa liên hệ có id = ${req.params.id}` });
};

exports.deleteAll = (req, res) => {
  res.send({ message: "Xóa tất cả liên hệ" });
};

exports.findAllFavorite = (req, res) => {
  res.send({ message: "Trả về tất cả liên hệ yêu thích" });
};

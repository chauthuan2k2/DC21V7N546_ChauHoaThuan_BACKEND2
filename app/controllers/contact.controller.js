const ContactService = require("../services/contact.service");
const MongoDB = require("../utils/mongodb.util");
const ApiError = require("../api-error");

const getService = () => new ContactService(MongoDB.client);

// ======= Lấy một liên hệ =======
exports.findOne = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) return next(new ApiError(400, "Missing id parameter"));

  try {
    const contactService = getService();
    const document = await contactService.findById(id);
    if (!document) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.send(document);
  } catch (error) {
    console.error("FindOne error:", error);
    return next(new ApiError(500, `Error retrieving contact with id=${id}`));
  }
};

// ======= Tạo mới liên hệ =======
exports.create = async (req, res, next) => {
  if (!req.body?.name) {
    return next(new ApiError(400, "Name cannot be empty"));
  }

  try {
    const contactService = getService();
    const document = await contactService.create(req.body);
    return res.status(201).json({
      success: true,
      message: "Liên hệ được tạo thành công",
      contact: document,
    });
  } catch (error) {
    console.error("Create error:", error);
    return next(new ApiError(500, "An error occurred while creating the contact"));
  }
};

// ======= Lấy tất cả liên hệ =======
exports.findAll = async (req, res, next) => {
  try {
    const contactService = getService();
    const { name } = req.query;
    const documents = name
      ? await contactService.findByName(name)
      : await contactService.find({});
    return res.send(documents);
  } catch (error) {
    console.error("FindAll error:", error);
    return next(new ApiError(500, "An error occurred while retrieving contacts"));
  }
};

// ======= Cập nhật liên hệ =======
exports.update = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) return next(new ApiError(400, "Missing id parameter"));
  if (!req.body || Object.keys(req.body).length === 0) {
    return next(new ApiError(400, "Data to update cannot be empty"));
  }

  try {
    const contactService = getService();
    const updated = await contactService.update(id, req.body);
    if (!updated) {
      return next(new ApiError(404, "Contact not found"));
    }

    // ✅ Trả về JSON chuẩn cho frontend
    return res.status(200).json({
      success: true,
      message: "Cập nhật thành công",
      contact: updated,
    });
  } catch (error) {
    console.error("Update error:", error);
    return next(new ApiError(500, `Error updating contact with id=${id}`));
  }
};

// ======= Xóa một liên hệ =======
exports.delete = async (req, res, next) => {
  const id = req.params?.id;
  if (!id) return next(new ApiError(400, "Missing id parameter"));

  try {
    const contactService = getService();
    const deleted = await contactService.delete(id);
    if (!deleted) {
      return next(new ApiError(404, "Contact not found"));
    }
    return res.status(200).json({
      success: true,
      message: "Liên hệ đã được xóa thành công",
      contact: deleted,
    });
  } catch (error) {
    console.error("Delete error:", error);
    return next(new ApiError(500, `Could not delete contact with id=${id}`));
  }
};

// ======= Lấy danh sách yêu thích =======
exports.findAllFavorite = async (req, res, next) => {
  try {
    const contactService = getService();
    const documents = await contactService.findFavorite();
    return res.send(documents);
  } catch (error) {
    console.error("FindAllFavorite error:", error);
    return next(new ApiError(500, "An error occurred while retrieving favorite contacts"));
  }
};

// ======= Xóa tất cả =======
exports.deleteAll = async (req, res, next) => {
  try {
    const contactService = getService();
    const deleteCount = await contactService.deleteAll();
    return res.status(200).json({
      success: true,
      message: `${deleteCount} liên hệ đã được xóa thành công`,
    });
  } catch (error) {
    console.error("DeleteAll error:", error);
    return next(new ApiError(500, "An error occurred while removing all contacts"));
  }
};

const { ObjectId } = require("mongodb");

class ContactService {
    constructor(client) {
        this.Contact = client.db("contactbook").collection("contacts"); // thêm tên DB
    }

    extractContactData(payload) {
        const contact = {
            name: payload.name,
            email: payload.email,
            address: payload.address,
            phone: payload.phone,
            favorite: payload.favorite,
            job: payload.job,
        };
        Object.keys(contact).forEach(
            (key) => contact[key] === undefined && delete contact[key]
        );
        return contact;
    }

    async create(payload) {
        const contact = this.extractContactData(payload);
        const result = await this.Contact.insertOne(contact); 
        return { _id: result.insertedId, ...contact };
    }

    async find(filter) {
        const cursor = await this.Contact.find(filter);
        return await cursor.toArray();
    }

    async findByName(name) {
        return await this.find({
            name: { $regex: new RegExp(name), $options: "i" }, 
        });
    }

async findById(id) {
    return await this.Contact.findOne({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
}

 async update(id, payload) {
        // 1. Chỉ lấy các trường dữ liệu hợp lệ
        const filter = {
            _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
        };
        const updateData = this.extractContactData(payload);
        
        // 2. Thực hiện cập nhật bằng findOneAndUpdate
        const result = await this.Contact.findOneAndUpdate(
            filter, // Điều kiện tìm kiếm (theo ID)
            { $set: updateData }, // Dữ liệu cần cập nhật
            { 
                returnDocument: "after" // QUAN TRỌNG: Trả về đối tượng SAU KHI cập nhật
            }
        );
        
        // 3. Hàm findOneAndUpdate trả về { value: contact, ok: 1 }
        // Trả về đối tượng liên hệ (hoặc null nếu không tìm thấy)
        return result.value; 
    }

    async delete(id) {
        const result = await this.Contact.findOneAndDelete({
        _id: ObjectId.isValid(id) ? new ObjectId(id) : null,
    });
    return result;
    }

    async findFavorite() {
    return await this.find({ favorite: true });
    }

    async deleteAll() {
        const result = await this.Contact.deleteMany({});
    return result.deletedCount;
    }
}

module.exports = ContactService;
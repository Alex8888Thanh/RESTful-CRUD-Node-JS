// Ta đồng thời phải tạo thư mục utils trong thư mục gốc, bên trong có index.js và db.js, tôi sẽ nhắc đến ở ngay dưới đoạn code này
import {queryBuilder} from "../utils";

/**
 * Tìm SP theo ID
 * @param id
 * @returns {Promise<any>}
 */
export function findById(id) {
  return new Promise((resolve, reject) => {
    queryBuilder("product").select().where({id}).then((data) => {
      if (data && data.length === 1) {
        resolve(data[0])
      } else {
        throw Error('no.data')
      }
    }).catch((ex) => {
      reject(ex)
    })
  })
}

/**
 * Tìm theo mã của sản phẩm
 * @param code
 * @returns {Knex.QueryBuilder}
 */
export function findByCode(code) {
  return queryBuilder("product").select().where({product_code: code})
}

/**
 * Xóa sản phẩm
 * @param id
 * @returns {Knex.QueryBuilder}
 */
export const deleteProduct = (id) => {
  return queryBuilder("product").delete().where({id})
}

/**
 * Tạo mới or update sản phẩm
 * @param payload
 */
export const upsertProduct = (payload) => {
  const {id, product_code, product_name, supplier, quantity} = payload;
  if (id) {
    const dataToUpdate = {}; // Chỉ lưu dữ liệu có nghĩa, và ko đc cập nhật product_code
    if (product_name && product_name.trim()) {
      dataToUpdate.product_name = product_name;
    }
    if (supplier && supplier.trim()) {
      dataToUpdate.supplier = supplier;
    }
    if (!isNaN(quantity) && Number(quantity) > 0) {
      dataToUpdate.quantity = Number(quantity);
    }
    return queryBuilder("product").update(dataToUpdate).where({id});
  } else {
    // Sau này add thêm logic check ko duplicate product_code nữa.
    return queryBuilder("product").insert({
      product_code, product_name, supplier, quantity
    });
  }
}


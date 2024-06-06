const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();
const moment = require("moment");
const { handleResponse } = require("../utils/handleResponse");

const PRIVATE_KEY = process.env.PRIVATE_KEY.replace(/\\n/g, "\n");
const CLIENT_EMAIL = process.env.CLIENT_EMAIL;
const SHEET_ID = process.env.SHEET_ID;

// Khởi tạo trang tính - SHEET_ID nằm trên thanh url
const doc = new GoogleSpreadsheet(SHEET_ID);

const authenticate = async () => {
  await doc.useServiceAccountAuth({
    client_email: CLIENT_EMAIL,
    private_key: PRIVATE_KEY,
  });

  // Auto load dữ liệu sau khi thêm mới thành công
  await doc.loadInfo();
};

/**
 * Tương tác với dữ liệu của server để thực hiện chức năng checkin
 * @param {*} req phoneNumber, userName lấy từ client
 * @returns Thời gian đã checkin
 */
module.exports.checkinService = async (req) => {
  const { phoneNumber, userName } = req;

  // Phân quyền cho tài khoản
  await authenticate();

  // Lấy ra trang tính hiện tại (trang excel)
  const sheet = doc.sheetsByIndex[0];
  await sheet.loadCells("A1:E1000");

  // Lấy ra thời gian hiện tại
  const now = moment();
  const nowFormatted = now.format("HH:mm:ss DD/MM/YYYY");
  const today = now.startOf("day");

  for (let rowIndex = 1; rowIndex < sheet.rowCount; rowIndex++) {
    const phoneCell = sheet.getCell(rowIndex, 0);
    const nameCell = sheet.getCell(rowIndex, 1);
    const checkinCell = sheet.getCell(rowIndex, 2);
    const checkoutCell = sheet.getCell(rowIndex, 3);
    const totalHoursCell = sheet.getCell(rowIndex, 4);

    if (
      nameCell.value == userName &&
      phoneCell.value == phoneNumber &&
      moment(checkinCell.value, "HH:mm:ss DD/MM/YYYY").isSame(today, "day")
    ) {
      const checkinTime = moment(checkinCell.value, "HH:mm:ss DD/MM/YYYY");

      if (checkoutCell.value) {
        // Nếu đã checkout thì sẽ cập nhật thời gian mới nhất
        checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");

        // Tính toán tổng thời gian đã làm việc
        const duration = moment.duration(moment().diff(checkinTime));
        const totalHours = duration.asHours();
        totalHoursCell.value = totalHours.toFixed(2);

        handleResponse(res, 201, `Checkout thành công lúc ${result}`, null);
      } else {
        // Nếu chưa checkin và chưa có thời gian checkout thì sẽ thêm thời gian checkout
        checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");
        handleResponse(res, 201, `Checkin thành công lúc ${result}`, null);
      }

      // Lưu tất cả các hàng đã thêm vào
      await sheet.saveUpdatedCells();

      return checkoutCell.value;
    }
  }

  return nowFormatted;
};

/**
 * Tương tác với dữ liệu của server để thực hiện chức năng checkout
 * @param {*} req phoneNumber, userName lấy từ client
 * @returns Thời gian đã checkout
 */
module.exports.checkoutService = async (req) => {
  const { phoneNumber, userName } = req;

  await authenticate();
  const sheet = doc.sheetsByIndex[0];

  // Tải tất cả các hàng, cột từ cột A1 đến cột E1000
  await sheet.loadCells("A1:E1000");

  // Lấy ra ngày hiện tại
  const today = moment().startOf("day");

  for (let rowIndex = 1; rowIndex < sheet.rowCount; rowIndex++) {
    const phoneCell = sheet.getCell(rowIndex, 0);
    const nameCell = sheet.getCell(rowIndex, 1);
    const checkinCell = sheet.getCell(rowIndex, 2);
    const checkoutCell = sheet.getCell(rowIndex, 3);
    const totalHoursCell = sheet.getCell(rowIndex, 4);

    if (
      nameCell.value == userName &&
      phoneCell.value == phoneNumber &&
      moment(checkinCell.value, "HH:mm:ss DD/MM/YYYY").isSame(today, "day")
    ) {
      const checkinTime = moment(checkinCell.value, "HH:mm:ss DD/MM/YYYY");

      if (checkoutCell.value) {
        // Nếu đã checkout thì sẽ cập nhật thời gian mới nhất
        checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");
      } else {
        // Nếu chưa checkin và chưa có thời gian checkout thì sẽ thêm thời gian checkout
        checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");
      }

      // Tính toán tổng thời gian đã làm việc
      const duration = moment.duration(moment().diff(checkinTime));
      const totalHours = duration.asHours();
      totalHoursCell.value = totalHours.toFixed(2);

      // Lưu tất cả các hàng đã thêm vào
      await sheet.saveUpdatedCells();

      return checkoutCell.value;
    }
  }

  // Trả về thời gian đã checkout
  return moment().format("HH:mm:ss DD/MM/YYYY");
};

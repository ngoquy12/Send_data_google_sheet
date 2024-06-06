const { handleResponse } = require("../utils/handleResponse");
const { GoogleSpreadsheet } = require("google-spreadsheet");
require("dotenv").config();
const moment = require("moment");

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

module.exports.checkinController = async (req, res) => {
  try {
    const { phoneNumber, userName } = req.body;

    // Phân quyền cho tài khoản
    await authenticate();

    // Lấy ra trang tính hiện tại (trang excel)
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells("A1:E1000");

    // Lấy ra thời gian hiện tại
    const now = moment();
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
          // Nếu đã checkout thì thông báo người dùng đã checkout rồi
          handleResponse(
            res,
            400,
            "Bạn đã Check Out rồi. Không thể Check In lại trong cùng một ngày.",
            null
          );
        } else {
          // Nếu đã checkin nhưng chưa checkout, thực hiện checkout
          checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");

          // Tính toán tổng thời gian đã làm việc
          const duration = moment.duration(moment().diff(checkinTime));
          const totalHours = duration.asHours();
          totalHoursCell.value = totalHours.toFixed(2);

          await sheet.saveUpdatedCells();

          handleResponse(
            res,
            200,
            `Checkout thành công lúc ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
            null
          );
        }
        return;
      }
    }

    // Nếu chưa checkin, thực hiện checkin mới
    await sheet.addRow({
      "Số điện thoại": phoneNumber,
      "Họ và Tên": userName,
      "Thời Gian Checkin": moment().format("HH:mm:ss DD/MM/YYYY"),
      "Thời Gian Checkout": "",
      "Tổng Thời Gian Làm": "",
    });

    handleResponse(
      res,
      201,
      `Checkin thành công lúc ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
      null
    );
  } catch (error) {
    console.log(error);
    // Thông báo nếu có lỗi từ server
    handleResponse(res, 500, "Đã có lỗi xảy ra", error);
  }
};

module.exports.checkoutController = async (req, res) => {
  try {
    const { phoneNumber, userName } = req.body;

    // Phân quyền cho tài khoản
    await authenticate();

    // Lấy ra trang tính hiện tại (trang excel)
    const sheet = doc.sheetsByIndex[0];
    await sheet.loadCells("A1:E1000");

    // Lấy ra thời gian hiện tại
    const now = moment();
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
          // Nếu đã checkout thì thông báo người dùng đã checkout rồi
          handleResponse(
            res,
            400,
            "Bạn đã Check Out rồi. Không thể Check In lại trong cùng một ngày.",
            null
          );
        } else {
          // Nếu đã checkin nhưng chưa checkout, thực hiện checkout
          checkoutCell.value = moment().format("HH:mm:ss DD/MM/YYYY");

          // Tính toán tổng thời gian đã làm việc
          const duration = moment.duration(moment().diff(checkinTime));
          const totalHours = duration.asHours();
          totalHoursCell.value = totalHours.toFixed(2);

          await sheet.saveUpdatedCells();

          handleResponse(
            res,
            200,
            `Checkout thành công lúc ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
            null
          );
        }
        return;
      }
    }

    handleResponse(
      res,
      201,
      `Checkin thành công lúc ${moment().format("HH:mm:ss DD/MM/YYYY")}`,
      null
    );
  } catch (error) {
    console.log(error);
    // Thông báo nếu có lỗi từ server
    handleResponse(res, 500, "Đã có lỗi xảy ra", error);
  }
};

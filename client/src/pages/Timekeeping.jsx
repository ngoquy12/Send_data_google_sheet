import { Button, Checkbox, Input, message } from "antd";
import React, { useState } from "react";
import BABE_URL from "../api/index";
import Loader from "../components/loader";

export default function Timekeeping() {
  // State chứa thông tin của đối tượng user
  const [user, setUser] = useState({
    userName: "",
    phoneNumber: "",
  });
  const [showLoader, setShowLoader] = useState(false);

  // Các State cảnh báo lỗi cho người dùng
  const [userNameError, setUserNameError] = useState("");
  const [phoneNumberError, setPhoneNumberError] = useState("");

  // Validate dữ liệu đầu vào
  const validateData = (value, name) => {
    let isValid = true;
    if (name === "userName") {
      if (!value) {
        setUserNameError("Họ và tên không được để trống");
        isValid = false;
      } else {
        setUserNameError("");
      }
    }

    if (name === "phoneNumber") {
      if (!value) {
        setPhoneNumberError("Số điện thoại không được để trống");
        isValid = false;
      } else {
        setPhoneNumberError("");
      }
    }

    return isValid;
  };

  // Lấy giá trị trong ô input
  const handleChange = (e) => {
    const { value, name } = e.target;

    // Cập nhật lại State của đối tượng user
    setUser({
      ...user,
      [name]: value,
    });

    // Gọi hàm validate mỗi khi thay đổi giá trị trong từng input
    validateData(value, name);
  };

  // Reset form sau khi thêm mới thành công
  const resetForm = () => {
    setUser({
      userName: "",
      phoneNumber: "",
    });
    setUserNameError("");
    setPhoneNumberError("");
  };

  const handleSubmit = (type) => {
    const nameValid = validateData(user.userName, "userName");
    const phoneValid = validateData(user.phoneNumber, "phoneNumber");

    if (nameValid && phoneValid) {
      if (type == "checkin") {
        BABE_URL.post("timekeeping/checkin", user)
          .then((response) => {
            if (response.data.status === 201) {
              // Hiển thị thông báo
              message.success(response.data.message);

              // Reset giá trị trong input
              resetForm();

              // Tắt loading
              setShowLoader(false);
            } else {
              // Hiển thị thông báo
              message.success(response.data.message);

              // Reset giá trị trong input
              resetForm();

              // Tắt loading
              setShowLoader(false);
            }
          })
          .catch((error) => {
            if (error.response.data.status === 400) {
              message.error(error.response.data.message);
              // Reset giá trị trong input
              resetForm();

              // Tắt loading
              setShowLoader(false);
            } else {
              message.error("Đã có lỗi xảy ra");
            }
          });
      } else {
        BABE_URL.put("timekeeping/checkout", user)
          .then((response) => {
            if (response.data.status === 200) {
              // Hiển thị thông báo
              message.success(response.data.message);

              // Reset giá trị trong input
              resetForm();

              // Tắt loading
              setShowLoader(false);
            }
          })
          .catch((error) => {
            if (error.response.data.status === 400) {
              message.error(error.response.data.message);
              // Reset giá trị trong input
              resetForm();

              // Tắt loading
              setShowLoader(false);
            } else {
              message.error("Đã có lỗi xảy ra");
            }
          });
      }
    }
  };

  return (
    <div
      className="flex h-screen justify-center items-center"
      style={{
        backgroundImage:
          "url(https://phunugioi.com/wp-content/uploads/2021/11/Background-banner-1.jpg)",
      }}
    >
      <div
        style={{ backgroundColor: "rgba(255, 255, 255, 0.8)" }}
        className="relative border w-[450px] rounded shadow-sm px-[24px] py-[20px] flex flex-col gap-6"
        onSubmit={handleSubmit}
      >
        {/* Hiển thị hiệu ứng loader trong quá trình gửi dữ liệu */}
        {showLoader && <Loader />}

        <h3 className="uppercase text-[22px] font-bold text-center">
          Chấm công online
        </h3>
        <div className="flex flex-col gap-2 relative">
          <label className="font-semibold" htmlFor="userName">
            Họ và tên
          </label>
          <Input
            status={`${userNameError ? "error" : ""}`}
            onChange={handleChange}
            value={user.userName}
            name="userName"
            className="h-10"
            id="userName"
          />
          {userNameError && (
            <span className="error absolute top-[72px] text-[14px] text-red-500">
              {userNameError}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 relative">
          <label className="font-semibold" htmlFor="phoneNumber">
            Số điện thoại
          </label>
          <Input
            value={user.phoneNumber}
            status={`${phoneNumberError ? "error" : ""}`}
            onChange={handleChange}
            name="phoneNumber"
            className="h-10"
            id="phoneNumber"
          />
          {phoneNumberError && (
            <span className="error absolute top-[72px] text-[14px] text-red-500">
              {phoneNumberError}
            </span>
          )}
        </div>

        <div className="flex flex-col gap-2 mt-2">
          <Checkbox>
            <b>Chấm công hộ</b>
          </Checkbox>
          <div className="flex gap-2">
            <Button
              onClick={() => handleSubmit("checkin")}
              htmlType="submit"
              className="bg-blue-600 h-10 flex-1"
              type="primary"
              success
            >
              Check In
            </Button>
            <Button
              onClick={() => handleSubmit("checkout")}
              htmlType="submit"
              className="bg-blue-600 h-10 flex-1"
              type="primary"
              danger
            >
              Check Out
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}

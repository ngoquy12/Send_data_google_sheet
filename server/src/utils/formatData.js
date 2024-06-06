module.exports.formatDate = (date) => {
  const today = new Date(date);

  let hour = today.getHours();
  const ampm = hour >= 12 ? "PM" : "AM";
  hour = hour % 12;
  hour = hour ? hour : 12; // hour '0' should be '12'
  hour = hour < 10 ? `0${hour}` : hour;

  let minute = today.getMinutes();
  minute = minute < 10 ? `0${minute}` : minute;

  let second = today.getSeconds();
  second = second < 10 ? `0${second}` : second;

  let day = today.getDate();
  day = day < 10 ? `0${day}` : day;

  let month = today.getMonth() + 1;
  month = month < 10 ? `0${month}` : month;

  let year = today.getFullYear();

  return `${hour}:${minute}:${second} ${ampm} ${day}/${month}/${year}`;
};

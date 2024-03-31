function formatDate(dateString) {
  // Convert the date string to a Date object
  let dateObject = new Date(dateString);

  // Extract date components
  let day = dateObject.getDate();
  let month = dateObject.getMonth() + 1; // Months are zero based, so we add 1
  let year = dateObject.getFullYear() % 100; // Take only the last two digits of the year
  let hours = dateObject.getHours();
  let minutes = dateObject.getMinutes();

  // We make sure day, month, hours, and minutes values have two digits
  day = day < 10 ? '0' + day : day;
  month = month < 10 ? '0' + month : month;
  hours = hours < 10 ? '0' + hours : hours;
  minutes = minutes < 10 ? '0' + minutes : minutes;

  // We construct the formatted date string
  // let formattedDate = day + '/' + month + '/' + year + ',' + hours + ':' + minutes;
  let formattedDate = day + '/' + month + '/' + year;

  return formattedDate;
}

module.exports = formatDate;
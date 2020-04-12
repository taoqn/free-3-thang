const moment = require("moment");

function parseDate(str) {
    var day;
    if (str) {
        if (str.length === 4) {
            day = moment(`1/1/${str}`, "D/M/YYYY");
        } else if (str.length === 8 || str.length === 9 || str.length === 10) {
            day = moment(str, "D/M/YYYY");
        } else {
            day = moment(str, "YYYY-MM-DD HH:mm:ss");
        }
    }
    return day;
}

function formatDate(date, format, isNumber = false) {
    var day = parseDate(date);
    return day ? (isNumber ? `${moment(day).format(format)}` : `'${moment(day).format(format)}'`) : 'NULL';
}

module.exports = {
    // views
    formatNgaySinh: (date, isNumber = false) => date ? formatDate(date, 'YYYY-MM-DD', isNumber) : 'NULL',
    formatNamSinh: (date, isNumber = true) => date ? formatDate(date, 'YYYY', isNumber) : 'NULL',
    // parse
    parseNgaySinh: ngaySinh => parseDate(ngaySinh),
    parseNgaySinh2SQL: ngaySinh => formatNgaySinh(parseDate(ngaySinh)),
    parseNamSinh2SQL: ngaySinh => formatNamSinh(parseDate(ngaySinh)),
};
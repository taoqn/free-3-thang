
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\dulieugoc\\VÂN CANH.xlsx',
    header: {
        rows: 4 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "STT",
        "B": "HoTen",
        "C": "NamSinh",
        "D": "DiaChi",
        "E": "LoaiDoiTuong",
        "F": "CMND",
        "G": "GhiChu",
    }
});

fs.writeFileSync(path.join(__dirname, '../../../data/NCC/VanCanh/Data.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
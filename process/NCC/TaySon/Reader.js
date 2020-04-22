
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\dulieugoc\\ncc\\TÂY SƠN.xlsx',
    header: {
        rows: 2 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "STT",
        "B": "HoTen",
        "C": "NamSinh",
        "D": "Thon",
        "E": "Xa",
        "F": "LoaiDoiTuong",
        "G": "CMND",
        "H": "GhiChu",
    }
});

fs.writeFileSync(path.join(__dirname, '../../../data/NCC/TaySon/Data.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
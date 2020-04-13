
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\1\\2.xls',
    header: {
        rows: 7 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "SoSoHN",
        "B": "TTHN",
        "C": "HoTen",
        "D": "QuanHeChuHo",
        "E": "GioiTinh",
        "F": "CMND",
        "G": "NgaySinh",
    }
});

fs.writeFileSync(path.join(__dirname, '../../data/TuyPhuoc/HoCanNgeo.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
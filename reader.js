
const fs = require('fs');
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\1\\1.xls',
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

fs.writeFileSync('./src/data/TuyPhuoc/HoNgeo.json', JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
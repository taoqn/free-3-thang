
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\1\\nguoilaodong.xls',
    header: {
        rows: 7 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "STT",
        "B": "HoTen",
        "C": "CMND",
        "D": "Nam",
        "E": "Nu",
        "F": "NgheNghiep",
        "G": "DoiTuong1",
        "H": "DoiTuong2",
        "I": "DoiTuong3",
        "J": "DoiTuong4",
        "K": "TenDN",
        "L": "MSTDN",
    },
    sheets: ['Phụ lục 02']
});

fs.writeFileSync(path.join(__dirname, '../../data/DoanhNghiep/NguoiLaoDong.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
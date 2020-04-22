
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\dulieugoc\\btxh\\DANH SACH HO TRO COVID 19- Trung tam CTXH va BTXH.xls',
    header: {
        rows: 7 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "STT",
        "B": "HoTen",
        "C": "NamSinh",
        "D": "DonVi",
        "E": "LoaiDoiTuong",
        "F": "CMND",
        "G": "GhiChu",
    }
});

fs.writeFileSync(path.join(__dirname, '../../data/TT_CTXH_BTXH/Data.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
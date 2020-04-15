
const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\1\\doanhnghiep.xls',
    header: {
        rows: 12 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "STT",
        "B": "TenDN",
        "C": "TongSoLD",
        "D": "SoLDLamViec",
        "E": "SoLDNgungViec",
        "F": "SoLDTamHoan",
        "G": "SoLDHuongBaoHiemThoiViec",
        "H": "MST"
    }
});

fs.writeFileSync(path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiep.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});

const fs = require('fs');
const path = require("path");
const excelToJson = require('convert-excel-to-json');

const result = excelToJson({
    sourceFile: 'C:\\Users\\nutha\\Desktop\\1\\DMuc_nganhnghe.xls',
    header: {
        rows: 7 // 2, 3, 4, etc.
    },
    columnToKey: {
        "A": "Ma",
        "B": "Ten"
    }
});

fs.writeFileSync(path.join(__dirname, '../../data/NganhNgheKinhDoanh/NganhNgheKinhDoanh.json'), JSON.stringify(result), (err) => {
    if (err) throw err;
    console.log('Data written to file');
});
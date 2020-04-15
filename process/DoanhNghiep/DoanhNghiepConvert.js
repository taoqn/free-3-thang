const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
// Tên Database
const NameDatabase = `HoTroCovid`;
// const NameDatabase = `CovidClone`;
// Paths
const input = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiep.json');
const output = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiep.sql');
// Datas
const rawdata = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
// Constants
const sqlDoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[DoanhNghiep] ([ID],[Ten],[MaSoThue]) VALUES`;
// Xác định mối quan hệ chủ hộ
rawdata.forEach((doanhnghiep, index) => {
    //
    fileOutput.write(`-- row: [${index}];\n`);
    //
    let MST = doanhnghiep.MST ? `'${doanhnghiep.MST}'` : 'NULL';
    if (MST.split(" ").length > 1) {
        MST = MST.split(" ").join("");
    }
    fileOutput.write(`${sqlDoanhNghiep} ('${uuidv4()}', N'${doanhnghiep.TenDN}', ${MST});\n`);
});
const fs = require('fs');
const path = require("path");
const { getJSON } = require("../../utils/callApi");
const { v4: uuidv4 } = require('uuid');
// Tên Database
const NameDatabase = `HoTroCovid`;
// const NameDatabase = `CovidClone`;
// Paths
const input = path.join(__dirname, '../../data/DoanhNghiep/NguoiLaoDong.json');
const output = path.join(__dirname, '../../data/DoanhNghiep/NguoiLaoDong.sql');
// Datas
const rawdata = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
// Constants
const sqlCaNhan = `INSERT INTO ${NameDatabase}.dbo.CaNhan (ID, HoTen, GioiTinh, NgaySinh, CMND, SoDienThoai, SinhNam, SoKhaiSinh, DiaChi, IDPhuongXa, IDQuanHuyen) VALUES`;
// Xác định mối quan hệ chủ hộ
rawdata.forEach(async (canhan, index) => {
    //
    fileOutput.write(`-- row: [${index}];\n`);
    // const doanhnghiep = await getJSON(`https://api-covid.gdtvietnam.com/odata`, `/DoanhNghieps?$filter=MaSoThue eq '${canhan.MSTDN}'`).then(result => result.data);
    //
    // let CMND = canhan.CMND ? `'${canhan.CMND}'` : 'NULL';
    // if (CMND.split(" ").length > 1) {
    //     CMND = CMND.split(" ").join("");
    // }
    if (canhan.CMND) {
        if (canhan.CMND.length > 9) {
            console.log(index, " === ", canhan.CMND, " === ", canhan.HoTen)
        }
    }
    //
    // if (CMND !== 'NULL') {
    //     console.log(`/CaNhans?$filter=CMND eq ${CMND}`);
    //     getJSON(`https://api-covid.gdtvietnam.com/odata`, `/CaNhans?$filter=CMND eq ${CMND}`)
    //         .then(result => result && result.data)
    //         .then(data => data && data.value)
    //         .then(value => {
    //             if (value.length === 0) {
    //                 return;
    //             }
    //             fileOutput.write(`${sqlCaNhan} ('${uuidv4()}', N'${canhan.HoTen}', ${CMND});\n`);
    //         });
    // } else {
    //     fileOutput.write(`${sqlCaNhan} ('${uuidv4()}', N'${canhan.HoTen}', ${CMND});\n`);
    // }
});
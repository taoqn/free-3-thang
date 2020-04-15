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
rawdata.forEach(async (nguoilaodong, index) => {
    //
    fileOutput.write(`-- row: [${index}];\n`);
    const finded = await getJSON(`https://api-covid.gdtvietnam.com/odata`, `/DoanhNghieps?$filter=MaSoThue eq '${nguoilaodong.MSTDN}'`).then(result => result.data);
    //
    // let MST = doanhnghiep.MST ? `'${doanhnghiep.MST}'` : 'NULL';
    // if (MST.split(" ").length > 1) {
    //     MST = MST.split(" ").join("");
    // }
    fileOutput.write(`${sqlCaNhan} ('${uuidv4()}', N'${doanhnghiep.TenDN}', ${MST});\n`);
});
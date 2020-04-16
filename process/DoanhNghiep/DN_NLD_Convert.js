const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { getJSON } = require("../../utils/callApi");
const { parseNgaySinh, formatNgaySinh, formatNamSinh } = require("../../utils/ngaySinh");
// Tên Database
const NameDatabase = `HoTroCovid`;
// const NameDatabase = `CovidClone`;
// Paths
const input = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiepNguoiLaoDong.json');
const output = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiepNguoiLaoDong.sql');
// Datas
const doanhnghieps = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
// Const
const IDDoiTuong1 = 1, DaTra50_1 = true, doituong_1 = null;
const IDDoiTuong2 = 1, DaTra50_2 = false, doituong_2 = null;
const IDDoiTuong3 = 1, DaTra50_3 = null, doituong_3 = null;
const IDDoiTuong4 = 4, DaTra50_4 = null, doituong_4 = '8540ba47-a84e-46f0-a108-b16507bc412e';
// Constants
const sqlDoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[DoanhNghiep] (ID,Ten,MaSoThue) VALUES`;
const sqlCaNhan = `INSERT INTO [${NameDatabase}].[dbo].[CaNhan] (ID, HoTen, GioiTinh, NgaySinh, CMND, SinhNam) VALUES`;
const sqlCaNhan_DoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[CaNhan_DoanhNghiep] (ID, IDDoanhNghiep, IDCaNhan, IDDoiTuong, NgheNghiep, DaTra50) VALUES`;
const sqlCaNhan_DoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[CaNhan_DoanhNghiep] (ID, IDDoanhNghiep, IDCaNhan, IDDoiTuong, NgheNghiep, DaTra50) VALUES`;
const sqlThongTinHoTro = `INSERT INTO [${NameDatabase}].[dbo].[ThongTinHoTro] (ID, IDNoiDung, IDDoiTuong, IDCaNhan) VALUES`;
//
doanhnghieps.forEach(async (doanhnghiep, index) => {
    fileOutput.write(`-- row - doanh-nghiep: [${index}]);\n`);
    fileOutput.write(`${sqlDoanhNghiep} ('${doanhnghiep.ID}', N'${doanhnghiep.TenDN}', '${doanhnghiep.MST}');\n`);
    await doanhnghiep.canhans.forEach(async (canhan, index2) => {
        if (canhan.CMND) {
            await getJSON(`https://api-covid.gdtvietnam.com/odata`, `/CaNhans?$filter=CMND eq '${canhan.CMND}'`)
                .then(result => result && result.data)
                .then(data => data && data.value)
                .then(value => {
                    if (value.length === 0) {
                        parseCaNhan(canhan);
                        return;
                    }
                    console.log(value[0].CMND, " - ", value[0].HoTen, " |||| ", canhan.CMND, " - ", canhan.HoTen);
                })
                .catch(err => {
                    console.log(canhan.CMND, canhan.HoTen);
                })
                ;
        } else {
            parseCaNhan(canhan);
        }
    });
});

function parseCaNhan(canhan) {
    let GioiTinh;
    let NgaySinh;
    if (canhan.Nu) {
        GioiTinh = 0;
        NgaySinh = parseNgaySinh(canhan.Nu);
    }
    if (canhan.Nam) {
        GioiTinh = 1;
        NgaySinh = parseNgaySinh(canhan.Nam);
    }
    let CMND = canhan.CMND ? `'${canhan.CMND}'` : 'NULL';
    fileOutput.write(`${sqlCaNhan} ('${canhan.ID}', N'${canhan.HoTen}', ${GioiTinh ? `${GioiTinh}` : `NULL`}, ${formatNgaySinh(NgaySinh)}, ${CMND}, ${formatNamSinh(NgaySinh)});\n`);
    // Xác định đối tượng
    const idCaNhan_DoanhNghiep = uuidv4();
    if (canhan.DoiTuong1) {
        fileOutput.write(`${sqlCaNhan_DoanhNghiep} ('${idCaNhan_DoanhNghiep}', '${canhan.IDDN}', '${canhan.ID}', ${doituong_1 ? `'${doituong_1}'` : `NULL`}, '${canhan.NgheNghiep}', ${DaTra50_1});\n`);
    } else if (canhan.DoiTuong2) {
        fileOutput.write(`${sqlCaNhan_DoanhNghiep} ('${idCaNhan_DoanhNghiep}', '${canhan.IDDN}', '${canhan.ID}', ${doituong_2 ? `'${doituong_2}'` : `NULL`}, '${canhan.NgheNghiep}', ${DaTra50_2});\n`);
    } else if (canhan.DoiTuong3) {
        fileOutput.write(`${sqlCaNhan_DoanhNghiep} ('${idCaNhan_DoanhNghiep}', '${canhan.IDDN}', '${canhan.ID}', ${doituong_3 ? `'${doituong_3}'` : `NULL`}, '${canhan.NgheNghiep}', ${DaTra50_3});\n`);
    } else if (canhan.DoiTuong4) {
        fileOutput.write(`${sqlCaNhan_DoanhNghiep} ('${idCaNhan_DoanhNghiep}', '${canhan.IDDN}', '${canhan.ID}', ${doituong_4 ? `'${doituong_4}'` : `NULL`}, '${canhan.NgheNghiep}', ${DaTra50_4});\n`);
    }
}
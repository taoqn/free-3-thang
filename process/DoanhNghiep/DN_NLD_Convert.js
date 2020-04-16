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
const NguoiTao = 'solaodong';
const SoThang = 3;
const DaChi = 0;
const IDNoiDung1 = 1, SoTien_1 = 1800000, ThanhTien_1 = 5400000, DaTra50_1 = 1, doituong_1 = null;
const IDNoiDung2 = 1, SoTien_2 = 1800000, ThanhTien_2 = 5400000, DaTra50_2 = 0, doituong_2 = null;
const IDNoiDung3 = 1, SoTien_3 = 1800000, ThanhTien_3 = 5400000, DaTra50_3 = null, doituong_3 = null;
const IDNoiDung4 = 4, SoTien_4 = 1000000, ThanhTien_4 = 3000000, DaTra50_4 = null, doituong_4 = '8540ba47-a84e-46f0-a108-b16507bc412e';
// SQL
const sqlDoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[DoanhNghiep] (ID,Ten,MaSoThue) VALUES`;
const sqlCaNhan = `INSERT INTO [${NameDatabase}].[dbo].[CaNhan] (ID, HoTen, GioiTinh, NgaySinh, CMND, SinhNam) VALUES`;
const sqlCaNhan_DoanhNghiep = `INSERT INTO [${NameDatabase}].[dbo].[CaNhan_DoanhNghiep] (ID, IDDoanhNghiep, IDCaNhan, IDDoiTuong, NgheNghiep, DaTra50) VALUES`;
const sqlThongTinHoTro = `INSERT INTO [${NameDatabase}].[dbo].[ThongTinHoTro] (ID, IDNoiDung, IDDoiTuong, IDCaNhan) VALUES`;
const sqlHoSo = `INSERT INTO [${NameDatabase}].[dbo].[HoSo] (ID, IDCaNhan, IDNoiDungHoTro, IDDoiTuong, SoThang, SoTien, ThanhTien, IDThongTinHoTro, DaChi, NguoiTao) VALUES`;
//
function parseCaNhan(canhan, finded) {
    if (finded === undefined) {
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
        // console.log(canhan.HoTen, " - ", GioiTinh);
        fileOutput.write(`${sqlCaNhan} ('${canhan.ID}', N'${canhan.HoTen}', ${GioiTinh === undefined ? `NULL` : GioiTinh}, ${formatNgaySinh(NgaySinh)}, ${canhan.CMND ? `'${canhan.CMND}'` : 'NULL'}, ${formatNamSinh(NgaySinh)});\n`);
    }
    // Xác định đối tượng
    if (canhan.DoiTuong1) {
        generateSQLDoiTuong(finded, canhan, IDNoiDung1, SoTien_1, ThanhTien_1, DaTra50_1, doituong_1);
    } else if (canhan.DoiTuong2) {
        generateSQLDoiTuong(finded, canhan, IDNoiDung2, SoTien_2, ThanhTien_2, DaTra50_2, doituong_2);
    } else if (canhan.DoiTuong3) {
        generateSQLDoiTuong(finded, canhan, IDNoiDung3, SoTien_3, ThanhTien_3, DaTra50_3, doituong_3);
    } else if (canhan.DoiTuong4) {
        generateSQLDoiTuong(finded, canhan, IDNoiDung4, SoTien_4, ThanhTien_4, DaTra50_4, doituong_4);
    }
}
function generateSQLDoiTuong(finded, canhan, IDNoiDung, SoTien, ThanhTien, DaTra50, doituong) {
    const idCaNhan = finded === undefined ? `${canhan.ID}` : `${finded.ID}`;
    const idThongTinHoTro = uuidv4();
    fileOutput.write(`${sqlCaNhan_DoanhNghiep} ('${uuidv4()}', '${canhan.IDDN}', '${idCaNhan}', ${convertIDDoituong(doituong)}, N'${canhan.NgheNghiep}', ${DaTra50});\n`);
    fileOutput.write(`${sqlThongTinHoTro} ('${idThongTinHoTro}', ${IDNoiDung}, ${convertIDDoituong(doituong)}, '${idCaNhan}');\n`);
    fileOutput.write(`${sqlHoSo} ('${uuidv4()}', '${idCaNhan}', ${IDNoiDung}, ${convertIDDoituong(doituong)}, ${SoThang}, ${SoTien}, ${ThanhTien}, '${idThongTinHoTro}', ${DaChi}, '${NguoiTao}');\n`);
}
function convertIDDoituong(doituong) {
    return `${doituong ? `'${doituong}'` : `NULL`}`;
}
console.log(doanhnghieps.length);
//
let promises = [];
doanhnghieps.forEach((doanhnghiep, index) => {
    if (index >= 60 && index < 110) {
        // fileOutput.write(`-- row - doanh-nghiep: [${index}]);\n`);
        fileOutput.write(`${sqlDoanhNghiep} ('${doanhnghiep.ID}', N'${doanhnghiep.TenDN}', '${doanhnghiep.MST}');\n`);
        doanhnghiep.canhans.forEach((canhan) =>
            promises.push(new Promise((resolve, reject) => {
                if (canhan.CMND) {
                    getJSON(`https://api-covid.gdtvietnam.com/odata`, `/CaNhans?$filter=CMND%20eq%20%27${canhan.CMND}%27`)
                        .then(result => result && result.data)
                        .then(data => {
                            if (data && data.value && data.value.length === 0) {
                                parseCaNhan(canhan);
                                resolve(true);
                                return;
                            }
                            parseCaNhan(canhan, data[0]);
                            console.log(data);
                            resolve(true);
                        })
                        .catch(err => {
                            // console.log(err);
                            console.log(doanhnghiep.MST, doanhnghiep.TenDN, " | ", canhan.CMND, canhan.HoTen);
                            reject(err);
                        });
                } else {
                    parseCaNhan(canhan);
                }
            }))
        );
    }
});
// Call all promies
Promise.all(promises)
    .then((values) => {
        console.log(values);
    })
    .catch((err) => {
        // console.log(err);
    })
    .finally(() => { console.log('end !') })
    ;
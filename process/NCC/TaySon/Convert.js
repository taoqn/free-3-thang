const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { parseNgaySinh, formatNgaySinh, formatNamSinh } = require("../../../utils/ngaySinh");
// Tên Database
const NameDatabase = `CovidChinhThuc`;
// const NameDatabase = `CovidClone`;
const NguoiTaoDL = `Nguyễn Đình Tạo`;
//
const DoiTuongs = require('../DoiTuong.json');
// Paths
const input = path.join(__dirname, '../../../data/NCC/TaySon/Data.json');
const output = path.join(__dirname, '../../../data/NCC/TaySon/Data.sql');
// Datas
const rows = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
//
const sqlCaNhan = `INSERT INTO ${NameDatabase}.dbo.CaNhan (ID, HoTen, NgaySinh, CMND, SinhNam, DiaChi, IDPhuongXa, IDQuanHuyen, SoKhaiSinh, NguoiTaoDL) VALUES`;
const sqlThongTinHoTro = `INSERT INTO ${NameDatabase}.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, IDCaNhan, NguoiTaoDL) VALUES`;
const sqlChiTiet_BTXH = `INSERT INTO ${NameDatabase}.dbo.ChiTiet_NguoiCoCong (ID_ThongTin, NguoiTaoDL) VALUES`;
// //
const XaPhuongs = [
    { name: 'Tây Thuận, huyện Tây Sơn', id: 93 },
    { name: 'Tây Giang, huyện Tây Sơn', id: 95 },
    { name: 'Vĩnh An, huyện Tây Sơn', id: 102 },
    { name: 'Tây Phú, huyện Tây Sơn', id: 105 },
    { name: 'Tây Xuân, huyện Tây Sơn', id: 103 },
    { name: 'Bình Nghi, Tây Sơn', id: 104 },
    { name: 'Phú Phong, huyện Tây Sơn', id: 91 },
    { name: 'Bình Thành, huyện Tây Sơn', id: 96 },
    { name: 'Bình Hòa, huyện Tây Sơn', id: 98 },
    { name: 'Bình Tân, huyện Tây Sơn', id: 92 },
    { name: 'Tây Bình, huyện Tây Sơn', id: 99 },
    { name: 'Tây Vinh, huyện Tây Sơn', id: 101 },
    { name: 'Tây An, huyện Tây Sơn', id: 97 },
    { name: 'Bình Tường, huyện Tây Sơn', id: 100 },
]
function xaPhuong(diachi) {
    const finded = XaPhuongs.find(XaPhuong => XaPhuong.name === diachi);
    if (finded) {
        return finded.id;
    }
    return null;
}
function checkDoiTuong(LoaiDoiTuong) {
    const DoiTuong = DoiTuongs.filter(DoiTuong => DoiTuong.Ten.includes(LoaiDoiTuong));
    if (DoiTuong.length === 0) {
        return null;
    }
    return DoiTuong[0].ID;
}
//
let Doituongs = [];
let DiaChis = [];
//
rows.forEach((CaNhan, index) => {
    fileOutput.write(`-- row: [${index}]);\n`);
    const IDCaNhan = uuidv4();
    const IDThongTinHoTro = uuidv4();
    const NgaySinh = parseNgaySinh(CaNhan.NamSinh);
    let CMND = null, SoKhaiSinh = null;
    if (CaNhan.CMND !== undefined) {
        if (`${CaNhan.CMND}`.length === 9) {
            CMND = CaNhan.CMND;
        }
        if (`${CaNhan.CMND}`.length === 11) {
            const cms = CaNhan.CMND.split('.');
            CMND = cms.join('');
        }
        if (CaNhan.GhiChu === 'Số khai sinh' || CaNhan.GhiChu === 'Số Khai sinh') {
            SoKhaiSinh = CaNhan.CMND;
        }
    }
    if (Doituongs.find(Doituong => Doituong === `${CaNhan.LoaiDoiTuong}`) === undefined) {
        Doituongs.push(`${CaNhan.LoaiDoiTuong}`);
    }
    // if (DiaChis.find(DiaChi => DiaChi === `${CaNhan.Xa}`) === undefined) {
    //     DiaChis.push(`${CaNhan.Xa}`);
    // }
    fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', N'${CaNhan.HoTen.replace(/'/gi, "''")}', ${formatNgaySinh(NgaySinh)}, ${CMND === null ? 'NULL' : `'${CMND}'`}, ${formatNamSinh(NgaySinh)}, ${CaNhan.Thon ? `N'${CaNhan.Thon}'` : 'NULL'}, ${xaPhuong(CaNhan.Xa)}, 7, ${SoKhaiSinh ? `N'${SoKhaiSinh}'` : 'NULL'}, N'${NguoiTaoDL}');\n`);
    fileOutput.write(`${sqlThongTinHoTro} ('${IDThongTinHoTro}', 6, ${checkDoiTuong(CaNhan.LoaiDoiTuong) === null ? `NULL` : `'${checkDoiTuong(CaNhan.LoaiDoiTuong)}'`}, '${IDCaNhan}', N'${NguoiTaoDL}');\n`);
    fileOutput.write(`${sqlChiTiet_BTXH} ('${IDThongTinHoTro}', N'${NguoiTaoDL}');\n`);
});
console.log(Doituongs);
// console.log(DiaChis);
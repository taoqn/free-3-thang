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
const input = path.join(__dirname, '../../../data/NCC/VanCanh/Data.json');
const output = path.join(__dirname, '../../../data/NCC/VanCanh/Data.sql');
// Datas
const rows = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
//
const sqlCaNhan = `INSERT INTO ${NameDatabase}.dbo.CaNhan (ID, HoTen, NgaySinh, CMND, SinhNam, DiaChi, IDPhuongXa, IDQuanHuyen, NguoiTaoDL) VALUES`;
const sqlThongTinHoTro = `INSERT INTO ${NameDatabase}.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, IDCaNhan, NguoiTaoDL) VALUES`;
const sqlChiTiet_BTXH = `INSERT INTO ${NameDatabase}.dbo.ChiTiet_NguoiCoCong (ID_ThongTin, NguoiTaoDL) VALUES`;
// //
const VanCanh = [
    'KP Tân Thuận, thị trấn Vân Canh',
    'KP Đăk Đưm, thị trấn Vân Canh',
    'KP Hiệp Giao, thị trấn Vân Canh',
    'KP TVăn 2, thị trấn Vân Canh',
    'Khu phố 3, thị trấn Vân Canh',
    'KP Thịnh Văn 1, thị trấn Vân Canh',
    'KP Hiệp Hà, thị trấn Vân Canh',
    'KP Hiệp Hội, thị trấn Vân Canh',
    'KP Canh Tân, thị trấn Vân Canh',
    'KP Thịnh Văn 1,thị trấn Vân Canh',
    'Khu phố 2, thị trấn Vân Canh',
    'KP TVăn 1, thị trấn Vân Canh',
    'thị trấn Vân Canh',
    'Khu phố 3,thị trấn Vân Canh'
];
const CanhThuan = [
    'Ka Xim, xã Canh Thuận',
    'HVT, xã Canh Thuận',
    'Ka Te, xã Canh Thuận',
    'Ka Bưng, xã Canh Thuận',
    'Hòn Mẻ, xã Canh Thuận',
    'HVD, xã Canh Thuận',
    'Hà Lũy, xã Canh Thuận'
];
const CanhVinh = [
    'Hiệp Vinh 2, xã Canh Vinh',
    'An Long 1, xã Canh Vinh',
    'Kinh Tế, xã Canh Vinh',
    'An Long 2, xã Canh Vinh',
    'Hiệp Vinh 1, xã Canh Vinh',
    'Tăng Lợi, xã Canh Vinh',
    'Tân vinh, xã Canh Vinh',
    'Tân Vinh, xã Canh Vinh',
];
const CanhLien = [
    'Kà Bông, xã Canh Liên',
    'Kon Lót, xã Canh Liên',
    'Làng Cát, xã Canh Liên',
    'Hà Giao, xã Canh Liên',
    'Kà Bưng, xã Canh Liên',
    'Canh Tiến, xã Canh Liên',
    'Làng Chồm, xã Canh Liên',
    'xã Canh Liên',
    'Kà Nâu, xã Canh Liên',
];
const CanhHiep = [
    'Thôn 4, xã Canh Hiệp',
    'Canh Giao, xã Canh Hiệp',
];
const CanhHien = [
    'xã Canh Hiển',
];
const CanhHoa = [
    'Canh Lãnh, xã Canh Hòa',
    'Canh Phước, xã Canh Hòa'
];
function xaPhuong(diachi) {
    if (VanCanh.includes(diachi)) {
        return 153;
    }
    if (CanhThuan.includes(diachi)) {
        return 158;
    }
    if (CanhVinh.includes(diachi)) {
        return 156;
    }
    if (CanhLien.includes(diachi)) {
        return 154;
    }
    if (CanhHiep.includes(diachi)) {
        return 155;
    }
    if (CanhHien.includes(diachi)) {
        return 157;
    }
    if (CanhHoa.includes(diachi)) {
        return 159;
    }
    return null;
}
// let Doituongs = [];
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
        } else {
            SoKhaiSinh = CaNhan.CMND;
        }
    }
    // if (Doituongs.find(Doituong => Doituong === `${CaNhan.LoaiDoiTuong}`) === undefined) {
    //     Doituongs.push(`${CaNhan.LoaiDoiTuong}`);
    // }
    if (DiaChis.find(DiaChi => DiaChi === `${CaNhan.DiaChi}`) === undefined) {
        DiaChis.push(`${CaNhan.DiaChi}`);
    }
    fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', N'${CaNhan.HoTen.replace(/'/gi, "''")}', ${formatNgaySinh(NgaySinh)}, ${CMND === null ? 'NULL' : `'${CMND}'`}, ${formatNamSinh(NgaySinh)}, ${CaNhan.DiaChi ? `N'${CaNhan.DiaChi}'` : 'NULL'}, ${xaPhuong(CaNhan.DiaChi)}, 11, N'${NguoiTaoDL}');\n`);
    fileOutput.write(`${sqlThongTinHoTro} ('${IDThongTinHoTro}', 6, ${checkDoiTuong(CaNhan.LoaiDoiTuong) === null ? `NULL` : `'${checkDoiTuong(CaNhan.LoaiDoiTuong)}'`}, '${IDCaNhan}', N'${NguoiTaoDL}');\n`);
    fileOutput.write(`${sqlChiTiet_BTXH} ('${IDThongTinHoTro}', N'${NguoiTaoDL}');\n`);
});

// console.log(Doituongs);

function checkDoiTuong(LoaiDoiTuong) {
    const DoiTuong = DoiTuongs.filter(DoiTuong => DoiTuong.Ten.includes(LoaiDoiTuong));
    if (DoiTuong.length === 0) {
        return null;
    }
    return DoiTuong[0].ID;
}
const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { parseNgaySinh, formatNgaySinh, formatNamSinh } = require("../../utils/ngaySinh");
// Tên Database
const NameDatabase = `CovidChinhThuc`;
// const NameDatabase = `CovidClone`;
const NguoiTaoDL = `Nguyễn Đình Tạo`;
// Paths
const input = path.join(__dirname, '../../data/TT_CTXH_BTXH/Data.json');
const output = path.join(__dirname, '../../data/TT_CTXH_BTXH/Data.sql');
// Datas
const rows = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
//
const sqlCaNhan = `INSERT INTO ${NameDatabase}.dbo.CaNhan (ID, HoTen, NgaySinh, CMND, NgayCap, SinhNam, SoKhaiSinh, DiaChi, NguoiTaoDL, IDDonVi) VALUES`;
const sqlThongTinHoTro = `INSERT INTO ${NameDatabase}.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, IDCaNhan, NguoiTaoDL) VALUES`;
const sqlChiTiet_BTXH = `INSERT INTO ${NameDatabase}.dbo.ChiTiet_BTXH (ID_ThongTin, NguoiTaoDL) VALUES`;
//
// let Doituongs = [];
function checkDoiTuong(LoaiDoiTuong) {
    switch (LoaiDoiTuong) {
        case 'Người cao tuổi':
            return '2a6e1659-3df9-48fb-9d72-fee104d98ccb';
        case 'Người cao tuổi khuyết tật':
            return '29bc15f4-d068-4e0a-a0db-14fc1abdf689';
        case 'Người khuyết tật':
            return '143346c7-9803-4bdb-861f-e01ea86f9bd4';
        case 'Trẻ em khuyết tật':
            return '0fd76b36-fc26-454a-87e9-277ffe434bb5';
        case 'Trẻ em mồ côi':
            return null;
        case 'Người từ 16 - 60 tuổi':
            return null;
        default:
            break;
    }
}
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
    fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', N'${CaNhan.HoTen.replace(/'/gi, "''")}', ${formatNgaySinh(NgaySinh)}, ${CMND === null ? 'NULL' : `'${CMND}'`}, NULL, ${formatNamSinh(NgaySinh)}, ${SoKhaiSinh === null ? 'NULL' : `N'${SoKhaiSinh}'`}, N'${CaNhan.DonVi}', N'${NguoiTaoDL}', 'ebbb3d73-f4c7-4405-a894-0ac684988a76');\n`);
    fileOutput.write(`${sqlThongTinHoTro} ('${IDThongTinHoTro}', 6, ${checkDoiTuong(CaNhan.LoaiDoiTuong) === null ? `NULL` : `'${checkDoiTuong(CaNhan.LoaiDoiTuong)}'`}, '${IDCaNhan}', N'${NguoiTaoDL}');\n`);
    fileOutput.write(`${sqlChiTiet_BTXH} ('${IDThongTinHoTro}', N'${NguoiTaoDL}');\n`);
    //
    // console.log(Doituongs);
});

// console.log(Doituongs);
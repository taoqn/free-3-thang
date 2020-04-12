const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { parseNgaySinh, formatNgaySinh, formatNamSinh } = require("../../utils/ngaySinh");
// Const
const GioiTinh = require('../../src/data/TuyPhuoc/DanhMuc/GioiTinh.json');
const QuanHeChuHo = require('../../src/data/TuyPhuoc/DanhMuc/QuanHeChuHo.json');
// Paths
const input = path.join(__dirname, '../../src/data/TuyPhuoc/HoNgeo.json');
const output = path.join(__dirname, '../../src/data/TuyPhuoc/HoNgeo.sql');
// Datas
const rawdata = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
// Constants
const IDNoiDungHoTro = 7;
const IDDoiTuong_HoNgheo = `9A2BDDB6-F259-47A6-9A3C-567D1ABD802A`;
const IDDoiTuong_HoCanNgheo = `A8DC9835-8882-4EBE-9895-910566A63F74`;
const sqlDiaChi = `INSERT INTO HoTroCovid.dbo.DiaChi (ID, IDQuanHuyen, IDPhuongXa, DiaChi, IDTinhThanh) VALUES`;
const sqlCaNhan = `INSERT INTO HoTroCovid.dbo.CaNhan (ID, HoTen, GioiTinh, NgaySinh, CMND, IDDiaChi, SoDienThoai, HinhAnh, SinhNam, SoKhaiSinh) VALUES`;
const sqlHoGiaDinh = `INSERT INTO HoTroCovid.dbo.HoGiaDinh (IDChuHo, IDPhuongXa, SoHoNgheo, TenHo) VALUES`;
const sqlThongTinHoTro = `INSERT INTO HoTroCovid.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, MaDinhDanh, IDCaNhan) VALUES`
const sqlChiTiet_HoNgheo = `INSERT INTO HoTroCovid.dbo.ChiTiet_HoNgheo (ID_ThongTin, IDHoGiaDinh, MoiQuanHe, ChuHo) VALUES`;
// Xác định mối quan hệ chủ hộ

// Write append file.
Object.keys(rawdata).forEach((idPhuongXa, indexPX) => {
    rawdata[idPhuongXa].forEach((canhan, indexCN) => {
        fileOutput.write(`-- row: [${indexPX}] - [${indexCN}]);\n`);
        // Dành cho địa chỉ
        const IDDiaChi = uuidv4();
        fileOutput.write(`${sqlDiaChi} ('${IDDiaChi}', NULL, ${idPhuongXa}, NULL, NULL);\n`);
        // Dành cho Cá nhân
        const IDCaNhan = uuidv4();
        const NgaySinh = parseNgaySinh(canhan.NgaySinh);
        let CMND = canhan.CMND ? ((canhan.CMND + "" === 1 + "" || canhan.CMND + "" === 2 + "") ? 'NULL' : `'${canhan.CMND}'`) : 'NULL';
        if (CMND.split(" ").length > 1) {
            CMND = CMND.split(" ").join("");
        }
        fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', '${canhan.HoTen}', ${GioiTinh.find(gt => gt.id + '' === canhan.GioiTinh + '').gioitinh}, ${formatNgaySinh(NgaySinh)}, ${CMND}, '${IDDiaChi}', NULL, NULL, ${formatNamSinh(NgaySinh)}, NULL);\n`);
        // Dành cho hộ gia đình
        if (canhan.QuanHeChuHo + "" === "1") {
            fileOutput.write(`${sqlHoGiaDinh} ('${IDCaNhan}', ${idPhuongXa}, '${canhan.SoSoHN}', NULL);\n`);
        }
        // Dành cho thông tin hồ sơ
        const IDThongTinHoTro = uuidv4();
        fileOutput.write(`${sqlThongTinHoTro} ('${IDThongTinHoTro}', ${IDNoiDungHoTro}, '${IDDoiTuong_HoNgheo}', '${IDCaNhan}');\n`);
        // Dành cho Chi tiết hộ nghèo
        fileOutput.write(`${sqlChiTiet_HoNgheo} ('${IDThongTinHoTro}', ${IDNoiDungHoTro}, '${IDDoiTuong_HoNgheo}', '${IDCaNhan}');\n`);
    })
});
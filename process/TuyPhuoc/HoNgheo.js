const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
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
const sqlCaNhan = `INSERT INTO HoTroCovid.dbo.CaNhan (ID, HoTen, GioiTinh, NgaySinh, CMND, IDDiaChi, SoDienThoai, HinhAnh, CreatedAt, UpdatedAt, SinhNam, SoKhaiSinh) VALUES `;
const sqlDiaChi = `INSERT INTO HoTroCovid.dbo.DiaChi (ID, IDQuanHuyen, IDPhuongXa, DiaChi, IDTinhThanh, CreatedAt, UpdatedAt) VALUES `;
const sqlHoGiaDinh = `INSERT INTO HoTroCovid.dbo.HoGiaDinh (IDChuHo, IDPhuongXa, SoHoNgheo, CreatedAt, UpdatedAt, TenHo) VALUES `;
const sqlThongTinHoTro = `INSERT INTO HoTroCovid.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, MaDinhDanh, CreatedAt, UpdatedAt, IDCaNhan) VALUES `
const sqlChiTiet_HoNgheo = `INSERT INTO HoTroCovid.dbo.ChiTiet_HoNgheo (ID_ThongTin, IDHoGiaDinh, MoiQuanHe, ChuHo, CreatedAt, UpdatedAt) VALUES `;
// Write append file.
Object.keys(rawdata).forEach(idPhuongXa => {
    rawdata[idPhuongXa].forEach(canhan => {
        fileOutput.write(`${sqlCaNhan} ('${uuidv4()}', '${canhan.HoTen}', );\n`);
    })
});
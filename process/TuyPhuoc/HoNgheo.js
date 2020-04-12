const fs = require('fs');
const path = require("path");
const moment = require("moment");
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
// const IDDoiTuong_HoCanNgheo = `A8DC9835-8882-4EBE-9895-910566A63F74`;
const sqlCaNhan = `INSERT INTO HoTroCovid.dbo.CaNhan (ID, HoTen, GioiTinh, NgaySinh, CMND, SoDienThoai, HinhAnh, SinhNam, SoKhaiSinh, DiaChi, IDPhuongXa, IDQuanHuyen) VALUES`;
const sqlHoGiaDinh = `INSERT INTO HoTroCovid.dbo.HoGiaDinh (IDChuHo, IDPhuongXa, SoHoNgheo, TenHo) VALUES`;
const sqlCaNhan_HoGiaDinh = `INSERT INTO HoTroCovid.dbo.CaNhan_HoGiaDinh (IDCaNhan, IDHoGiaDinh, MoiQuanHe) VALUES`;
const sqlThongTinHoTro = `INSERT INTO HoTroCovid.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, IDCaNhan) VALUES`;

// console.log(moment("01/01/1934", "D/M/YYYY").toLocaleString());
console.log(moment("29/02/1934", "D/M/YYYY").toLocaleString());

// Xác định mối quan hệ chủ hộ
let IDHoGiaDinh = null;
// Write append file.
Object.keys(rawdata).forEach((idPhuongXa, indexPX) => {
    rawdata[idPhuongXa].forEach((canhan, indexCN) => {
        fileOutput.write(`-- row: [${indexPX}] - [${indexCN}]);\n`);
        // Dành cho Cá nhân
        const IDCaNhan = uuidv4();
        const NgaySinh = parseNgaySinh(canhan.NgaySinh);
        let CMND = canhan.CMND ? ((canhan.CMND + "" === 1 + "" || canhan.CMND + "" === 2 + "") ? 'NULL' : `'${canhan.CMND}'`) : 'NULL';
        if (CMND.split(" ").length > 1) {
            CMND = CMND.split(" ").join("");
        }
        fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', N'${canhan.HoTen.replace(/'/gi, "''")}', ${GioiTinh.find(gt => gt.id + '' === canhan.GioiTinh + '').gioitinh}, ${formatNgaySinh(NgaySinh)}, ${CMND}, NULL, NULL, ${formatNamSinh(NgaySinh)}, NULL, NULL, ${idPhuongXa}, NULL);\n`);
        // Dành cho hộ gia đình
        if (canhan.QuanHeChuHo + "" === "1") {
            IDHoGiaDinh = IDCaNhan;
            fileOutput.write(`${sqlHoGiaDinh} ('${IDCaNhan}', ${idPhuongXa}, '${canhan.SoSoHN}', NULL);\n`);
        }
        // Dành cho bảng Cá nhân - Hộ gia đình
        fileOutput.write(`${sqlCaNhan_HoGiaDinh} ('${IDCaNhan}', '${IDHoGiaDinh}', N'${QuanHeChuHo.find(qhch => qhch.id + '' === canhan.QuanHeChuHo + '').name}');\n`);
        // Dành cho bảng Thông tin hỗ trợ
        fileOutput.write(`${sqlThongTinHoTro} ('${uuidv4()}', ${IDNoiDungHoTro}, '${IDDoiTuong_HoNgheo}', '${IDCaNhan}');\n`);
    })
});
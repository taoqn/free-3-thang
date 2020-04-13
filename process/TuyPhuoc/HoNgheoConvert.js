const fs = require('fs');
const path = require("path");
const { v4: uuidv4 } = require('uuid');
const { parseNgaySinh, formatNgaySinh, formatNamSinh } = require("../../utils/ngaySinh");
// Const
const GioiTinh = require('../../data/TuyPhuoc/DanhMuc/GioiTinh.json');
const QuanHeChuHo = require('../../data/TuyPhuoc/DanhMuc/QuanHeChuHo.json');
// Tên Database
const NameDatabase = `HoTroCovid`;
// const NameDatabase = `CovidClone`;
// Paths
const input = path.join(__dirname, '../../data/TuyPhuoc/HoNgeo.json');
const output = path.join(__dirname, '../../data/TuyPhuoc/HoNgeo.sql');
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
const sqlCaNhan = `INSERT INTO ${NameDatabase}.dbo.CaNhan (ID, HoTen, GioiTinh, NgaySinh, CMND, SoDienThoai, HinhAnh, SinhNam, SoKhaiSinh, DiaChi, IDPhuongXa, IDQuanHuyen) VALUES`;
const sqlHoGiaDinh = `INSERT INTO ${NameDatabase}.dbo.HoGiaDinh (IDChuHo, IDPhuongXa, SoHoNgheo, IDDoiTuong) VALUES`;
const sqlCaNhan_HoGiaDinh = `INSERT INTO ${NameDatabase}.dbo.CaNhan_HoGiaDinh (IDCaNhan, IDHoGiaDinh, MoiQuanHe) VALUES`;
const sqlThongTinHoTro = `INSERT INTO ${NameDatabase}.dbo.ThongTinHoTro (ID, IDNoiDung, IDDoiTuong, IDCaNhan) VALUES`;

// Xác định mối quan hệ chủ hộ
let DiaChi = null;
let IDHoGiaDinh = null;
// Write append file.
Object.keys(rawdata).forEach((idPhuongXa, indexPX) => {
    rawdata[idPhuongXa].forEach((canhan, indexCN) => {
        if (canhan.SoSoHN) {
            if (`${canhan.SoSoHN}`.toLowerCase().startsWith('tổng cộng') && canhan.GioiTinh) {
                // console.log(canhan.SoSoHN)
                return;
            }
            if (canhan.TTHN === undefined && canhan.HoTen === undefined && canhan.QuanHeChuHo === undefined && canhan.GioiTinh === undefined && canhan.CMND === undefined && canhan.NgaySinh === undefined) {
                console.log(canhan.SoSoHN)
                DiaChi = canhan.SoSoHN;
                return;
            }
        }
        fileOutput.write(`-- row: [${indexPX}] - [${indexCN}]);\n`);
        // Dành cho Cá nhân
        const IDCaNhan = uuidv4();
        const NgaySinh = parseNgaySinh(canhan.NgaySinh);
        let CMND = canhan.CMND ? ((canhan.CMND + "" === 1 + "" || canhan.CMND + "" === 2 + "") ? 'NULL' : `'${canhan.CMND}'`) : 'NULL';
        if (CMND.split(" ").length > 1) {
            CMND = CMND.split(" ").join("");
        }
        console.log(idPhuongXa, " ==== ", canhan.HoTen, " === ", DiaChi)
        fileOutput.write(`${sqlCaNhan} ('${IDCaNhan}', N'${canhan.HoTen.replace(/'/gi, "''")}', ${GioiTinh.find(gt => gt.id + '' === canhan.GioiTinh + '').gioitinh}, ${formatNgaySinh(NgaySinh)}, ${CMND}, NULL, NULL, ${formatNamSinh(NgaySinh)}, NULL, N'${DiaChi}', ${idPhuongXa}, NULL);\n`);
        // Dành cho hộ gia đình
        if (canhan.QuanHeChuHo + "" === "1") {
            IDHoGiaDinh = IDCaNhan;
            fileOutput.write(`${sqlHoGiaDinh} ('${IDCaNhan}', ${idPhuongXa}, '${canhan.SoSoHN}', '${IDDoiTuong_HoNgheo}');\n`);
        }
        // Dành cho bảng Cá nhân - Hộ gia đình
        fileOutput.write(`${sqlCaNhan_HoGiaDinh} ('${IDCaNhan}', '${IDHoGiaDinh}', N'${QuanHeChuHo.find(qhch => qhch.id + '' === canhan.QuanHeChuHo + '').name}');\n`);
        // Dành cho bảng Thông tin hỗ trợ
        fileOutput.write(`${sqlThongTinHoTro} ('${uuidv4()}', ${IDNoiDungHoTro}, '${IDDoiTuong_HoNgheo}', '${IDCaNhan}');\n`);
    })
});
const fs = require('fs');
const path = require("path");
const { getJSON } = require("../../utils/callApi");
const { v4: uuidv4 } = require('uuid');
// Paths
const _doanhnghiep = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiep.json');
const _nguoilaodong = path.join(__dirname, '../../data/DoanhNghiep/NguoiLaoDong.json');
const output = path.join(__dirname, '../../data/DoanhNghiep/DoanhNghiepNguoiLaoDong.json');
//
const doanhnghieps = JSON.parse(fs.readFileSync(_doanhnghiep));
const nguoilaodongs = JSON.parse(fs.readFileSync(_nguoilaodong));
// Clear context file
// fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
//
doanhnghieps.forEach((doanhnghiep, index) => {
    const idDN = uuidv4();
    doanhnghiep.ID = idDN;
    doanhnghiep.canhans = nguoilaodongs.filter(nguoilaodong => nguoilaodong.MSTDN === doanhnghiep.MST);
    doanhnghiep.canhans.forEach(canhan => {
        canhan.ID = uuidv4();
        canhan.IDDN = idDN;
    });
});
//
fs.writeFileSync(output, JSON.stringify(doanhnghieps));
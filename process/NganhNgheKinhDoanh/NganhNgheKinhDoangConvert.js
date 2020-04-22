const fs = require('fs');
const path = require("path");
// Tên Database
const NameDatabase = `HoTroCovid`;
// const NameDatabase = `CovidClone`;
// Paths
const input = path.join(__dirname, '../../data/NganhNgheKinhDoanh/NganhNgheKinhDoanh.json');
const output = path.join(__dirname, '../../data/NganhNgheKinhDoanh/NganhNgheKinhDoanh.sql');
// Datas
const NganhNgheKinhDoanhs = JSON.parse(fs.readFileSync(input));
// Clear context file
fs.truncate(output, 0, () => console.log(`Deleted content in file ${output}`));
// Streams file
var fileOutput = fs.createWriteStream(output, { flags: 'a' });
//
const sqlNganhNgheKinhDoanh = `INSERT INTO ${NameDatabase}.dbo.NganhNgheKinhDoanh (Ma, Ten) VALUES`;
//

NganhNgheKinhDoanhs.forEach((NganhNgheKinhDoanh, i) => {
    fileOutput.write(`${sqlNganhNgheKinhDoanh} (N'${NganhNgheKinhDoanh.Ma}', N'${NganhNgheKinhDoanh.Ten}');\n`);
});
import excelToJson from 'convert-excel-to-json';

/**
 * 
 * @param {*} key 
 */
export function DanhChoHoNgheo(path) {
    console.log(excelToJson({
        sourceFile: path
    }));
}

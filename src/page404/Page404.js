import React from "react";
import { Col, Row } from "reactstrap";
import { Container } from "../../../layout";
import { ViewImage } from "../../../others";
import { Link } from "react-router-dom";
import { v4 as uuidv4 } from "uuid";

import ward1 from "./1/ward1.json";
import ward2 from "./1/ward2.json";
import { FetchMapping } from "../../../actions/callApi";

// const good = () => {
//   let sql = `INSERT INTO district_shipping_partner (uuid, created_by, created_date, updated_by, updated_date, district_uuid, extra, id, shipping_partner_uuid) VALUES \n`;
//   let i = 0;
//   console.log("do dai tong: ", district1.length);
//   district1.forEach(async (e1) => {
//     // console.log(`${e1.prefix.toLowerCase()} ${e1.name.toLowerCase()}`);
//     const findeds = district2.filter(
//       (e2) =>
//         `${e1.prefix.toLowerCase()} ${e1.name.toLowerCase()}` ===
//         `${e2.DISTRICT_NAME.toLowerCase()}`
//     );

//     if (findeds.length === 1) {
//       findeds.forEach((finded) => {
//         sql += `('${uuidv4()}', 'dc093230-1604-4329-b33c-4f1e48a6f4fd', '2019-11-12 15:36:38.000', NULL, NULL, '${
//           e1.uuid
//         }', ${finded ? `'${finded.DISTRICT_VALUE}'` : "NULL"}, ${
//           finded ? `'${finded.DISTRICT_ID}'` : "NULL"
//         }, 'ad59a609-fc3a-4e8a-bdbc-0641efc95b9c'), \n`;
//       });
//     } else {
//       console.log(e1.uuid, e1.name, findeds);
//       console.log(i++);
//       const id = await FetchMapping(
//         `http://localhost:8082/api/public/category/District/findOne?id=${e1.uuid}`
//       )
//         .then((json) => json.json())
//         .then((result) => result.uuid)
//         .then((uuid) =>
//           FetchMapping(
//             `http://localhost:8088/api/public/CityOrProvinceShippingPartner?search=cityOrProvinceUuid%20%40eq%20%28uuid%7C${uuid}%29&select=id&count=true`
//           )
//             .then((json) => json.json())
//             .then((result) => result.content[0].id)
//         );
//       findeds.forEach((finded) => {
//         if (`${finded.PROVINCE_ID}` === `${id}`) {
//           console.log(
//             `('${uuidv4()}', 'dc093230-1604-4329-b33c-4f1e48a6f4fd', '2019-11-12 15:36:38.000', NULL, NULL, '${
//               e1.uuid
//             }', ${finded ? `'${finded.DISTRICT_VALUE}'` : "NULL"}, ${
//               finded ? `'${finded.DISTRICT_ID}'` : "NULL"
//             }, 'ad59a609-fc3a-4e8a-bdbc-0641efc95b9c'), \n`
//           );
//         }
//       });
//     }
//   });
//   console.log(sql);
// };

const good2 = () => {
  let sql = `INSERT INTO ward_or_commune_shipping_partner (uuid, created_by, created_date, updated_by, updated_date, ward_or_commune_uuid, extra, id, shipping_partner_uuid) VALUES \n`;
  let i = 0;
  console.log("do dai tong: ", ward1.length);
  ward1.forEach(async (e1) => {
    // console.log(`${e1.prefix.toLowerCase()} ${e1.name.toLowerCase()}`);
    const findeds = ward2.filter(
      (e2) =>
        `${e1.prefix.toLowerCase()} ${e1.name.toLowerCase()}` ===
        `${e2.WARDS_NAME.toLowerCase()}`
    );

    if (findeds.length === 1) {
      findeds.forEach((finded) => {
        sql += `('${uuidv4()}', 'dc093230-1604-4329-b33c-4f1e48a6f4fd', '2019-11-12 15:36:38.000', NULL, NULL, '${
          e1.uuid
        }', ${finded ? `'${finded.DISTRICT_VALUE}'` : "NULL"}, ${
          finded ? `'${finded.DISTRICT_ID}'` : "NULL"
        }, 'ad59a609-fc3a-4e8a-bdbc-0641efc95b9c'), \n`;
      });
    } else {
      console.log(e1.uuid, e1.name, findeds);
      console.log(i++);
      const id = await FetchMapping(
        `http://localhost:8082/api/public/category/District/findOne?id=${e1.uuid}`
      )
        .then((json) => json.json())
        .then((result) => result.uuid)
        .then((uuid) =>
          FetchMapping(
            `http://localhost:8088/api/public/CityOrProvinceShippingPartner?search=cityOrProvinceUuid%20%40eq%20%28uuid%7C${uuid}%29&select=id&count=true`
          )
            .then((json) => json.json())
            .then((result) => result.content[0].id)
        );
      findeds.forEach((finded) => {
        if (`${finded.PROVINCE_ID}` === `${id}`) {
          console.log(
            `('${uuidv4()}', 'dc093230-1604-4329-b33c-4f1e48a6f4fd', '2019-11-12 15:36:38.000', NULL, NULL, '${
              e1.uuid
            }', ${finded ? `'${finded.DISTRICT_VALUE}'` : "NULL"}, ${
              finded ? `'${finded.DISTRICT_ID}'` : "NULL"
            }, 'ad59a609-fc3a-4e8a-bdbc-0641efc95b9c'), \n`
          );
        }
      });
    }
  });
  console.log(sql);
};

export default function Page404(props) {
  good2();
  return (
    <Container {...props}>
      <div className="app flex-row align-items-center">
        <Row className="justify-content-center">
          <Col md="5">
            <div className="auth-form-wrap pt-xl-0 pt-70">
              <div className="auth-form w-xl-30 w-lg-65 w-sm-85 w-100 card pa-25 shadow-lg">
                <a className="auth-brand text-center d-block mb-45" href="/">
                  <ViewImage
                    concat={`/assets/img/logo.svg`}
                    height={150}
                    alt={process.env.REACT_APP_WEBSITE_NAME}
                  />
                </a>
                <form>
                  <h1 className="display-4 mb-10 text-center">
                    404. Không tìm thấy.
                  </h1>
                  <p className="mb-30 text-center">
                    Trang bạn yêu cầu thật sự không tồn tại. Bạn có thể{" "}
                    <Link to="/">
                      <u>trở về trang chủ</u>
                    </Link>{" "}
                    hoặc tìm kiếm đúng trang bạn đang cần tới.
                  </p>
                  <div className="form-group">
                    <div className="input-group">
                      <input
                        className="form-control form-control-lg filled-input rounded-input"
                        placeholder="Tìm và gõ Enter"
                        type="text"
                      />
                      <div className="input-group-append">
                        <span className="input-group-text">
                          <span className="feather-icon">
                            <i className="fas fa-search" />
                          </span>
                        </span>
                      </div>
                    </div>
                  </div>
                </form>
              </div>
            </div>
          </Col>
        </Row>
      </div>
    </Container>
  );
}

import moment from "moment";

const invoicePdf = (item) => {
  const date = moment(new Date()).format("DD/MM/YYYY");
  const id = item?.id;
  const name = item?.name;
  const birthday = item?.birthday;
  const address = item?.address;
  const service = item?.service;
  const content = item?.content || "";
  const amount = item?.amount;
  return `
  <!DOCTYPE html>
  <html lang="en">
  
  <head>
      <title>Home</title>
      <meta charset="UTF-8" />
      <meta name="viewport" content="width=device-width" />
  </head>
  <!-- .table td,
    .table th {
      border: 1px solid;
      text-align: center;
      vertical-align: middle;
    } -->
  
  <body>
      <table style="width: 100%; border-bottom: 1px solid">
          <tr>
              <td>
                  <img src="https://firebasestorage.googleapis.com/v0/b/bokingdental.appspot.com/o/images%2Flight.png?alt=media&token=6e096d7c-846d-4b5e-a7a9-7d8ba4c96d6d"
                      alt="" style="width: 300px" />
              </td>
              <td style="text-align: end">
                  <p style="padding-right: 40px; font-size: 15px; font-weight: 700; margin: 5px 0px;"><span
                          style="margin-bottom: 10px">PHIẾU KHÁM</span>
                      <br />ID: ${id}
                  </p>
              </td>
          </tr>
      </table>
      <table style="width: 100%; border-bottom: 1px solid; margin-top: 30px">
          <tr>
              <td>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 30px; font-weight: 700; margin: 5px 0px;">
                      Nha Khoa Tây Đô</p>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 15px; margin: 5px 0px;">27 phố Thú Y, Đức
                      Thượng , Hoài Đức , Hà
                      Nội Hà Nội</p>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 15px; margin: 5px 0px;">
                      dental.taydo@gmail.com</p>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 15px; margin: 5px 0px;">+84961106507</p>
              </td>
              <td style="text-align: start">
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 40px; font-weight: 700; margin: 5px 0px;">
                  </p>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 15px; font-weight: 700; margin: 5px 0px;">
                      ${name}</p>
                  <p style="padding-left: 40px; padding-right: 40px;font-size: 15px; margin: 5px 0px;">Ngày sinh:
                      ${birthday}</p>
                  <p style="padding-left: 40px; padding-right: 40px;font-size: 15px; margin: 5px 0px;">Địa chỉ: ${address}
                  </p>
              </td>
          </tr>
      </table>
      <p style="padding-left: 40px; font-size: 15px; font-weight: 700; margin-top: 15px">Ngày tạo: ${date}</p>
      <table style="padding-left: 40px; width: 90%; margin-top: 30px; border-collapse:collapse; margin: auto;">
          <thead>
              <tr>
                  <td style="border: 1px solid;  vertical-align: middle; padding: 0.75rem;">STT</td>
                  <td style="border: 1px solid; text-align: center; vertical-align: middle; padding: 0.75rem">Dịch vụ</td>
                  <td style="border: 1px solid; text-align: center; vertical-align: middle; padding: 0.75rem">Giá dịch vụ
                  </td>
              </tr>
          </thead>
          <tbody>
              ${service.map((x, index) => {
                return `
              <tr>
                  <td style="border: 1px solid;  vertical-align: middle; padding: 0.75rem;">${index + 1}</td>
                  <td style="border: 1px solid; text-align: center; vertical-align: middle; padding: 0.75rem">${x?.name}
                  </td>
                  <td style="border: 1px solid; text-align: center; vertical-align: middle; padding: 0.75rem">${
                    x?.price
                  }
                  </td>
              </tr>
              `;
              })}
          </tbody>
      </table>
      <table style="width: 100%;  margin-top: 30px">
          <tr>
              <td>
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 20px; font-weight: 700; margin:0px;">
                      Ghi của bác sĩ điều trị</p>
              </td>
              <td style="text-align: end; width: 300px; ">
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 20px; font-weight: 700; margin:  0px;">
                      Tổng: ${amount} VND
                  </p>
  
              </td>
          </tr>
      </table>
      <table style="width: 100%;">
          <tr>
              <td style="display: block;">
                  <p style="padding-left: 40px; padding-right: 40px; font-size: 15px; margin:0px;" dangerouslySetInnerHTML={{ __html: "${content}</p>
              </td>
              <td style="text-align: start; width: 300px; ">
                  <img src="https://firebasestorage.googleapis.com/v0/b/bokingdental.appspot.com/o/images%2F1.png?alt=media&token=d1b76bb2-98a5-482f-a05e-d775ef5cc2a8"
                      class="img-fluid" alt="" style="width: 100%;" />
              </td>
          </tr>
      </table>
      <table style="width: 100%;">
          <tr>
              <td>
              </td>
              <td style="text-align: center; width: 300px; ">
                  Nha khoa Tây Đô
              </td>
          </tr>
      </table>
  </body>
  
  </html>
`;
};
export default ("invoicePdf", invoicePdf);

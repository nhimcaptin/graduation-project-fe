import config from "config";
import dateFormat from "dateformat";
import sortObject from "sortobject";
import crypto from "crypto";
import querystring from "qs";

export const createdUrl = (req, res, next) => {
  var ipAddr =
    req.headers["x-forwarded-for"] ||
    req.connection.remoteAddress ||
    req.socket.remoteAddress ||
    req.connection.socket.remoteAddress;

  var tmnCode = "38JYBQLQ";
  var secretKey = "SFSXBSSVNDWLGCKFSREZPFKIEUBSGJFS";
  var vnpUrl = "https://sandbox.vnpayment.vn/paymentv2/vpcpay.html";
  var returnUrl = "https://graduation-project-fe.vercel.app";

  var date = new Date();

  var createDate = dateFormat(date, "yyyymmddHHmmss");
  var orderId = dateFormat(date, "HHmmss");
  var amount = req.body.amount;
  var bankCode = req.body.bankCode;

  var orderInfo = req.body.orderDescription;
  var orderType = req.body.orderType;
  var locale = req.body.language;
  if (locale === null || locale === "") {
    locale = "vn";
  }
  var currCode = "VND";
  var vnp_Params = {};
  vnp_Params["vnp_Version"] = "2.1.0";
  vnp_Params["vnp_Command"] = "pay";
  vnp_Params["vnp_TmnCode"] = tmnCode;
  // vnp_Params['vnp_Merchant'] = ''
  vnp_Params["vnp_Locale"] = locale;
  vnp_Params["vnp_CurrCode"] = currCode;
  vnp_Params["vnp_TxnRef"] = orderId;
  vnp_Params["vnp_OrderInfo"] = orderInfo;
  vnp_Params["vnp_OrderType"] = orderType;
  vnp_Params["vnp_Amount"] = amount * 100;
  vnp_Params["vnp_ReturnUrl"] = returnUrl;
  vnp_Params["vnp_IpAddr"] = ipAddr;
  vnp_Params["vnp_CreateDate"] = createDate;
  if (bankCode !== null && bankCode !== "") {
    vnp_Params["vnp_BankCode"] = bankCode;
  }

  vnp_Params = sortObject(vnp_Params);

  var signData = querystring.stringify(vnp_Params, { encode: false });
  var hmac = crypto.createHmac("sha512", secretKey);
  var signed = hmac.update(new Buffer(signData, "utf-8")).digest("hex");
  vnp_Params["vnp_SecureHash"] = signed;
  vnpUrl += "?" + querystring.stringify(vnp_Params, { encode: false });

  res.status(200).send({ vnpUrl: vnpUrl });
};

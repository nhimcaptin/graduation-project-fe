import React, { useEffect } from "react";
import apiService from "../../services/api-services";
import URL_PATHS from "../../services/url-path";

const Test = () => {
  const urlParams = new URLSearchParams(window.location.search);
  const vnp_TxnRef = urlParams.get("vnp_TxnRef");
  const vnp_PayDate = urlParams.get("vnp_PayDate");

  useEffect(() => {
    (async () => {
      console.log("123213");
      const data = {
        vnp_TxnRef: vnp_TxnRef,
        vnp_TransactionDate: vnp_PayDate,
      };
      const res: any = await apiService.post("api/querydr", data);
      if(res?.vnp_ResponseCode == "00"){
        console.log("Thanh toán thành công")
      }
    })();
  });

  return <div>Test</div>;
};

export default Test;

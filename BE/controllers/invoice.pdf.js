import pdf from "html-pdf";
import config from "config";
import invoicePdf from "../documents/invoicePdf.js";
import { fileURLToPath } from "url";
import { getStorage, ref, getDownloadURL, uploadBytesResumable } from "firebase/storage";
import { dirname } from "path";
import request from "request";
import * as fs from "fs";

export const createPdf = (req, res, next) => {
  const nameFile = `controllers/Invoice/PHIEU_KHAM_${new Date().getTime()}.pdf`;
  let feat_pdf = config.get("feat_pdf");
  pdf.create(invoicePdf(req.body), {}).toFile(nameFile, (err) => {
    if (err) {
      res.send(Promise.reject());
    }

    res.send(Promise.resolve());
    const dataObj = {
      nameFile,
    };
    request(
      {
        url: feat_pdf,
        method: "POST",
        json: true,
        body: dataObj,
      },
      async function (error, response, body) {
        try {
          return res.status(200).json(body);
        } catch (error) {
          next(error);
        }
      }
    );
  });
};

export const fetchPdf = async (req, res, next) => {
  try {
    const { nameFile } = req.body;
    const currentFile = fileURLToPath(import.meta.url);
    const storageFB = getStorage();
    const storageRef = ref(storageFB, nameFile);
    const fileBuffer = fs.readFileSync(nameFile);
    const metadata = {
      contentType: "application/pdf",
    };
    const snapshot = await uploadBytesResumable(storageRef, fileBuffer, metadata);
    const downloadURL = await getDownloadURL(snapshot.ref);
    res.status(200).send(downloadURL);
  } catch (error) {
    next(error);
  }
};

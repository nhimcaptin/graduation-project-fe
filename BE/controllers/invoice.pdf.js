import pdf from 'html-pdf';
import invoicePdf from "../documents/invoicePdf.js";
import {fileURLToPath}  from 'url' ;
import {dirname}  from 'path' ;
// const { dirname } = require('path');


export const createPdf = (req, res) => {
    pdf.create(invoicePdf(req.body), {}).toFile('result.pdf', (err) => {
        if(err) {
            res.send(Promise.reject());
        }

        res.send(Promise.resolve());
    });
};

// export const fetchPdf = (req, res) => {
//     res.sendFile(`${__dirname}/result.pdf`)
// };

export const fetchPdf = (req, res) => {
    const currentFile = fileURLToPath(import.meta.url);
    const currentDir = dirname(currentFile);
    res.sendFile(`${currentDir}/result.pdf`);
};

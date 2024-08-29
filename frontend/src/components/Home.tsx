import React, { useState } from "react";
import style from "./Home.module.css";
import axios from "axios";
import { PDFDocument } from "pdf-lib";

export default function Home() {
  const [pdfUrl, setPdfUrl] = useState("");
  const [newPdfData, setNewPdfData] = useState<Uint8Array | null>(null);

  const handleLoadPdf = () => {
    axios
      .get("/api/load", { responseType: "blob" })
      .then((res) => {
        const url = URL.createObjectURL(res.data);
        setPdfUrl(url);
        setNewPdfData(res.data);
      })
      .catch((err) => console.log(err));
  };

  const handleSavePdf = async () => {
    if (!newPdfData) {
      return;
    }

    try {
      const pdfDoc = await PDFDocument.load(newPdfData);
      const pdfBytes = await pdfDoc.save();

      const modifiedBlob = new Blob([pdfBytes], {
        type: "application/pdf",
      });

      const formData = new FormData();
      formData.append("file", modifiedBlob, "example.pdf");

      await axios.post("/api/save", formData, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });

      console.log("PDF saved successfully!");
    } catch (error) {
      console.error("Error saving PDF:", error);
    }
  };

  return (
    <>
      <div className={style.parentDiv}>
        <button onClick={handleLoadPdf}>Load Pdf</button>
        <button onClick={handleSavePdf}>Save Pdf</button>
      </div>
      <div className={style.pdf}>
        {pdfUrl && (
          <iframe
            src={pdfUrl}
            height="500px"
            width="100%"
          ></iframe>
        )}
      </div>
    </>
  );
}

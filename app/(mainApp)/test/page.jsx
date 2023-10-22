"use client";
import React, { useState } from "react";

const FileToBase64Page = () => {
  const [base64Data, setBase64Data] = useState("");

  const handleFileInputChange = (event) => {
    const file = event.target.files[0];
    const reader = new FileReader();

    reader.onloadend = () => {
      const base64String = reader.result.split(",")[1]; // Extracting base64 data from the result
      setBase64Data(base64String);
    };

    reader.readAsDataURL(file);
  };

  return (
    <div>
      <h1>File to Base64 Converter</h1>
      <input type="file" onChange={handleFileInputChange} />
      {base64Data && (
        <div>
          <h2>Base64 Data:</h2>
          <textarea value={base64Data} rows={10} cols={50} readOnly />
        </div>
      )}
    </div>
  );
};

export default FileToBase64Page;

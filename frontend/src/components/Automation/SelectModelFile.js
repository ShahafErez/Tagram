import React, { useState } from "react";

function SelectModelFile() {
  const [selectedFile, setSelectedFile] = useState(null);

  const handleFileSelect = (event) => {
    setSelectedFile(event.target.files[0]);
  };

  const handleFileUpload = () => {
    const formData = new FormData();
    formData.append("file", selectedFile);
    // TODO: add more and send to back
    fetch("/api/project/upload-user-model", {
      method: "POST",
      headers: {
        Accept: "application/json",
      },
      body: formData,
    })
      .then((response) => response.json())
      .then((data) => {
        setMetaTaggingLabels(data);
      });
  };

  return (
    <div>
      <input type="file" onChange={handleFileSelect} />
      <button onClick={handleFileUpload}>Upload</button>
    </div>
  );
}

export default SelectModelFile;

import React, { useState, useRef } from 'react';

function PDFViewer() {
  const [pdfContent, setPDFContent] = useState(null);
  const [signatures, setSignatures] = useState([]);
  const signatureRef = useRef(null);

  const handleFileChange = (event) => {
    const selectedFile = event.target.files[0];

    if (selectedFile) {
      const reader = new FileReader();

      reader.onload = (e) => {
        const pdfData = e.target.result;
        setPDFContent(pdfData);
      };

      reader.readAsArrayBuffer(selectedFile);
    }
  };

  const handleSignatureDragStart = (event) => {
    event.dataTransfer.setData('text/plain', 'signature'); // Data transfer for drag-and-drop
  };

  const handleSignatureDrop = (event) => {
    event.preventDefault();
    if (event.dataTransfer.getData('text/plain') === 'signature') {
      const x = event.clientX - event.target.getBoundingClientRect().left;
      const y = event.clientY - event.target.getBoundingClientRect().top;
      setSignatures([...signatures, { x, y }]);
    }
  };

  const closePDFViewer = () => {
    setPDFContent(null);
    setSignatures([]);
  };

  return (
    <div>
      <div>
        <input type="file" accept=".pdf" onChange={handleFileChange} />
      </div>
      {pdfContent ? (
        <div>
          <div className="pdf-toolbar">
            <button className="add-signature-button">Add Signature</button>
            <button onClick={closePDFViewer} className="close-button">
              Close PDF Viewer
            </button>
          </div>
          <div
            onDrop={handleSignatureDrop}
            onDragOver={(e) => e.preventDefault()}
            style={{ position: 'relative', height: '100%' }}
          >
            <object
              data={URL.createObjectURL(
                new Blob([new Uint8Array(pdfContent)], { type: 'application/pdf' })
              )}
              type="application/pdf"
              width="100%"
              height="1000vh"
            >
              PDF Viewer not available in your browser. Download the PDF to view it.
            </object>
            {signatures.map((signature, index) => (
              <div
                key={index}
                style={{
                  position: 'absolute',
                  left: signature.x,
                  top: signature.y,
                }}
                draggable
                onDragStart={handleSignatureDragStart}
                ref={signatureRef}
              >
                E-Signature {index + 1}
              </div>
            ))}
          </div>
        </div>
      ) : null}
    </div>
  );
}

export default PDFViewer;

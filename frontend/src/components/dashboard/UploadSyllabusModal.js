import React, { useState } from 'react';

const UploadSyllabusModal = ({ onClose, onSubmit, currentClass }) => {
  const [file, setFile] = useState(null);

  const handleFileChange = (e) => {
    setFile(e.target.files[0]);
  };

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <h3>Upload Syllabus for {currentClass.name}</h3>
        <div className="file-upload">
          <input type="file" onChange={handleFileChange} />
        </div>
        <div className="modal-actions">
          <button onClick={onClose}>Cancel</button>
          <button onClick={() => onSubmit(file)} disabled={!file}>
            Upload
          </button>
        </div>
      </div>
    </div>
  );
};

export default UploadSyllabusModal;
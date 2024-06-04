import React, { useState, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { createCertificateAttestation, Certificate,generateAndUploadPDF } from 'certified-sdk';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import DynamicConnectButton from "./walletWidget";

const CertificateForm = () => {
  const { primaryWallet } = useDynamicContext();
  const [formData, setFormData] = useState({
    artworkTitle: '',
    artistName: '',
    yearOfCompletion: '',
    dimensions: '',
    editionNumber: '',
    medium: '',
    registrationNumber: '',
    note: '',
    certificationName: '',
    certificationOrganization: ''
  });

  const [images, setImages] = useState({
    signature: null,
    artwork: null,
    marker: null
  });
  const [imageNames, setImageNames] = useState({
    signature: '',
    artwork: '',
    marker: ''
  });


  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');
  const [attestationLink, setAttestationLink] = useState('');



  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleImageChange = (e) => {
    const { name, files } = e.target;
    const file = files[0];
    if (file) {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImages((prevImages) => ({
          ...prevImages,
          [name]: reader.result
        }));
        setImageNames((prevImageNames) => ({
          ...prevImageNames,
          [name]: file.name
        }));
      };
      reader.readAsDataURL(file);
    }
  };
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!primaryWallet) {
      setError('Primary wallet not connected');
      return;
    }

    const extra = JSON.stringify({
      artworkTitle: formData.artworkTitle,
      artistName: formData.artistName,
      yearOfCompletion: formData.yearOfCompletion,
      dimensions: formData.dimensions,
      editionNumber: formData.editionNumber,
      medium: formData.medium,
      registrationNumber: formData.registrationNumber,
      note: formData.note,
      certificationName: formData.certificationName,
      certificationOrganization: formData.certificationOrganization
    });

    console.log("CertificateForm: extra", extra);

    try {
      const attestationResult = await createCertificateAttestation(
        primaryWallet,
        "default-name",  // (TO-DO Frank) : default name
        formData.note,
        formData.certificationName,
        formData.certificationOrganization,
        "default issue-to-wallet", // (TO-DO Frank) : default issue-to-wallet
        new Date("2020-02-03"), // (TO-DO Frank) : default expirationDate
        extra
      );

      // set the local state variable using the created attestation information
      setResult(attestationResult);
      const link = `https://scan.sign.global/attestation/${attestationResult.attestationId}`;
      setAttestationLink(link);

      setError(null);
      console.log("attestationResult", attestationResult);
      
    } catch (err) {
      setError(err.message);
    }
  };

  const handleGeneratePdfUrl = async () => {
    const certificateComponent = (
      <Certificate
        artworkTitle={formData.artworkTitle}
        artistName={formData.artistName}
        yearOfCompletion={formData.yearOfCompletion}
        dimensions={formData.dimensions}
        editionNumber={formData.editionNumber}
        medium={formData.medium}
        registrationNumber={formData.registrationNumber}
        dateOfCertification={new Date().toLocaleDateString('en-GB')}
        signatureImagePath={images.signature}
        artworkImagePath={images.artwork}
        markerImagePath={images.marker}
        certificateUrl={attestationLink}
      />
    );

    try {
      const pdfUrl = await generateAndUploadPDF(certificateComponent);
      setPdfUrl(pdfUrl);
    } catch (err) {
      if (err instanceof Error) {
        setError(err.message);
      } else {
        setError('An unknown error occurred');
      }
    }
  };


  return (
    <><div>
      </div>    <div>
        <h1>Create Certificate Attestation</h1>
        
              <DynamicConnectButton />


              <form onSubmit={handleSubmit}>
              <input name="artworkTitle" placeholder="Artwork Title" value={formData.artworkTitle} onChange={handleChange} />
              <input name="artistName" placeholder="Artist Name" value={formData.artistName} onChange={handleChange} />
              <input type="date" name="yearOfCompletion" placeholder="Year of Completion" value={formData.yearOfCompletion} onChange={handleChange} />
              <input name="dimensions" placeholder="Dimensions" value={formData.dimensions} onChange={handleChange} />
              <input name="editionNumber" placeholder="Edition Number" value={formData.editionNumber} onChange={handleChange} />
              <input name="medium" placeholder="Medium" value={formData.medium} onChange={handleChange} />
              <input name="registrationNumber" placeholder="Registration Number" value={formData.registrationNumber} onChange={handleChange} />
              <input name="note" placeholder="Note" value={formData.note} onChange={handleChange} />
              <input name="certificationName" placeholder="Certification Name" value={formData.certificationName} onChange={handleChange} />
              <input name="certificationOrganization" placeholder="Certification Organization" value={formData.certificationOrganization} onChange={handleChange} />
          
                  <button type="submit">Create Attestation</button>
              </form>

              {result && <div>Attestation Created: {JSON.stringify(result)}</div>}
              {error && <div>Error: {error}</div>}

              {records && <div>Records: {JSON.stringify(records)}</div>}
              <div>
                <h2>Upload Images</h2>
                <div>
                  <label>Signature Image</label>
                  <input type="file" name="signature" onChange={handleImageChange} />
                  {imageNames.signature && <p>Uploaded: {imageNames.signature}</p>}
                </div>

                <div>
                  <label>Artwork Image</label>
                  <input type="file" name="artwork" onChange={handleImageChange} />
                  {imageNames.artwork && <p>Uploaded: {imageNames.artwork}</p>}
                </div>

                <div>
                  <label>Marker Image</label>
                  <input type="file" name="marker" onChange={handleImageChange} />
                  {imageNames.marker && <p>Uploaded: {imageNames.marker}</p>}
                </div>

                <button onClick={handleGeneratePdfUrl}>Generate PDF URL</button>
                
              {pdfUrl && <div><a href={pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a></div>}
 

              </div>



          </div></>
  );
};

export default CertificateForm;

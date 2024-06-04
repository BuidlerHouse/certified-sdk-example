import React, { useState, ReactElement } from 'react';
import ReactDOM from 'react-dom';
import { createCertificateAttestation, Certificate } from 'certified-sdk';
import { useDynamicContext } from '@dynamic-labs/sdk-react-core';
import SignMessageButton from './SignMessageButton';
import DynamicConnectButton from "./walletWidget";
import html2canvas from 'html2canvas';
import { jsPDF } from 'jspdf';
import axios from 'axios';

import testSignature from './test_signature.png'; // Ensure the path is correct
import testImage from './test_image.png'; // Ensure the path is correct
import testMarkerImage from './test_markerImage.png'; // Ensure the path is correct

const CertificateForm = () => {
  const { primaryWallet } = useDynamicContext();
  const [formData, setFormData] = useState({
    name: '',
    note: '',
    certificationName: '',
    certificationOrganization: '',
    issuedToWallet: '',
    expirationDate: '',
    extra: ''
  });
  const [result, setResult] = useState(null);
  const [error, setError] = useState(null);
  const [records, setRecords] = useState(null);
  const [pdfUrl, setPdfUrl] = useState('');

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!primaryWallet) {
      setError('Primary wallet not connected');
      return;
    }


    const certificateComponent = (
      <Certificate
        artworkTitle="Boardwalk 1990"
        artistName="Tom Wilson"
        yearOfCompletion="21/12/2025"
        dimensions="254x50cm"
        editionNumber="7/50"
        medium="Embroidery on fabric, weaving with yarn or thread, batik on cotton"
        registrationNumber="sadaw346hdvbb"
        dateOfCertification="21/12/2025"
        signatureImagePath={testSignature}
        artworkImagePath={testImage}
        markerImagePath={testMarkerImage}
        certificateUrl="https://scan.sign.global/attestation/SPA_wskUuBJlnoH9Bunzoisee"
      />
    );


    try {
      const attestationResult = await createCertificateAttestation(
        primaryWallet,
        formData.name,
        formData.note,
        formData.certificationName,
        formData.certificationOrganization,
        formData.issuedToWallet,
        new Date(formData.expirationDate),
        formData.extra,
        certificateComponent
      );

      setResult(attestationResult);
      setPdfUrl(attestationResult.pdfUrl);
      setError(null);
      console.log("attestationResult", attestationResult);
      
    } catch (err) {
      setError(err.message);
    }
  };


  return (
    <><div>

         
      </div>    <div>
        <h1>Create Certificate Attestation</h1>
        
              <DynamicConnectButton />


              <form onSubmit={handleSubmit}>
                  <input name="name" placeholder="Name" value={formData.name} onChange={handleChange} />
                  <input name="note" placeholder="Note" value={formData.note} onChange={handleChange} />
                  <input name="certificationName" placeholder="Certification Name" value={formData.certificationName} onChange={handleChange} />
                  <input name="certificationOrganization" placeholder="Certification Organization" value={formData.certificationOrganization} onChange={handleChange} />
                  <input name="issuedToWallet" placeholder="Issued To Wallet" value={formData.issuedToWallet} onChange={handleChange} />
                  <input type="date" name="expirationDate" placeholder="Expiration Date" value={formData.expirationDate} onChange={handleChange} />
                  <input name="extra" placeholder="Extra" value={formData.extra} onChange={handleChange} />
                  <button type="submit">Create Attestation</button>
              </form>
              {result && <div>Attestation Created: {JSON.stringify(result)}</div>}
              {error && <div>Error: {error}</div>}
              <SignMessageButton />

              {records && <div>Records: {JSON.stringify(records)}</div>}

              {pdfUrl && <div><a href={pdfUrl} target="_blank" rel="noopener noreferrer">View PDF</a></div>}
 
          </div></>
  );
};

export default CertificateForm;

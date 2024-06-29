import {
  Certificate,
  createAttestation,
  createSignatureAttestation,
} from 'certified-sdk'
import React, { ReactElement, useState } from 'react'

import DynamicConnectButton from './walletWidget'
import ReactDOM from 'react-dom'
import { useDynamicContext } from '@dynamic-labs/sdk-react-core'

const testSignature = 'https://sdk-static.thecertified.xyz/test_signature.png'
const testImage = 'https://sdk-static.thecertified.xyz/test_image.png'
const testMarkerImage =
  'https://sdk-static.thecertified.xyz/test_markerImage.png'
const signatureAttestationUrl =
  'https://scan.sign.global/attestation/SPA_LGlskofpNXxzHgZoqR9MO'

const CertificateForm = () => {
  const { primaryWallet } = useDynamicContext()
  const [formData, setFormData] = useState({
    artworkTitle: 'Boardwalk 1990',
    artistName: 'Tom Wilson',
    yearOfCompletion: '12/21/2025',
    dimensions: '254x50cm',
    editionNumber: '1/50',
    medium:
      'Embroidery on fabric, weaving with yarn or thread, batik on cotton.',
    registrationNumber: '1',
    certificationOrganization: 'MarkMaker',
    apiKey: '',
  })

  const [result, setResult] = useState(null)
  const [error, setError] = useState(null)
  const [records, setRecords] = useState(null)
  const [attestationLink, setAttestationLink] = useState('')

  const handleChange = (e) => {
    const { name, value } = e.target
    setFormData({
      ...formData,
      [name]: value,
    })
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!primaryWallet) {
      setError('Primary wallet not connected')
      return
    }
    const extra = JSON.stringify({
      signatureImageUrl: testSignature, // PDF generate need this one
      markerImageUrl: testMarkerImage, // PDF generate need this one
      imageUrl: testImage, // PDF generate need this one
      editionNumber: 10, // PDF generate need this one
    })
    const metadata = JSON.stringify({
      artworkTitle: formData.artworkTitle,
      artistName: formData.artistName,
      yearOfCompletion: formData.yearOfCompletion,
      dateOfCertification: '12/21/2025',
      dimensions: formData.dimensions,
      medium: formData.medium,
      registrationNumber: formData.registrationNumber,
    })
    try {
      const attestationResult = await createAttestation(
        primaryWallet, // primaryWallet, from dynamic context,
        formData.registrationNumber, // certificate_id
        formData.artistName, // holderName of COA
        formData.medium, // details of COA
        'Certificate of Authenticity for Artwork: ' + formData.artworkTitle, // name of COA
        formData.certificationOrganization, // organizationName of COA
        [signatureAttestationUrl], // url, gonna be attested by the creator, if needed.
        extra, // extra, put imageUrls here
        metadata, // metadata, see above
        formData.apiKey // apiKey
      )
      // set the local state variable using the created attestation information
      setResult(attestationResult)
      const link = `https://scan.sign.global/attestation/${attestationResult.attestationId}`
      setAttestationLink(link)
      console.log('attestationLink', attestationLink)
      setError(null)
      console.log('attestationResult', attestationResult)
    } catch (err) {
      setError(err.message)
    }
  }

  return (
    <>
      <div></div>
      <div>
        <h1>Certified SDK Integration Demo</h1>

        <DynamicConnectButton />
        <form onSubmit={handleSubmit}>
          <input
            name="artworkTitle"
            placeholder="Artwork Title"
            value={formData.artworkTitle}
            onChange={handleChange}
          />
          <input
            name="artistName"
            placeholder="Artist Name"
            value={formData.artistName}
            onChange={handleChange}
          />
          <input
            type="date"
            name="yearOfCompletion"
            placeholder="Year of Completion"
            value={formData.yearOfCompletion}
            onChange={handleChange}
          />
          <input
            name="dimensions"
            placeholder="Dimensions"
            value={formData.dimensions}
            onChange={handleChange}
          />
          <input
            name="editionNumber"
            placeholder="Edition Number"
            value={formData.editionNumber}
            onChange={handleChange}
          />
          <input
            name="medium"
            placeholder="Medium"
            value={formData.medium}
            onChange={handleChange}
          />
          <input
            name="registrationNumber"
            placeholder="Registration Number"
            value={formData.registrationNumber}
            onChange={handleChange}
          />
          <input
            name="certificationOrganization"
            placeholder="Certification Organization"
            value={formData.certificationOrganization}
            onChange={handleChange}
          />
          <> </>
          <> </>
          <p>API KEY</p>
          <input
            name="apiKey"
            placeholder="API Key"
            value={formData.apiKey}
            onChange={handleChange}
          />
          <> </>
          <button type="submit">Create Attestation</button>
        </form>
        <button
          onClick={async () => {
            // MD5 (test_signature.png) = 7c0eeddad6609d5774c1300ece83569c, if you don't want to use 'hash', you can pass an empty string
            const result = await createSignatureAttestation(
              primaryWallet,
              testSignature,
              'Tom',
              '7c0eeddad6609d5774c1300ece83569c'
            )
            console.log(result)
            alert(result['url'])
            // https://scan.sign.global/attestation/SPA_LGlskofpNXxzHgZoqR9MO
          }}
        >
          Create Signature Attestation
        </button>
        {result && (
          <div>
            Attestation Created: {JSON.stringify(result)}, View pdf (edition 1){' '}
            {result.pdf}1
          </div>
        )}
        {error && <div>Error: {error}</div>}
        {records && <div>Records: {JSON.stringify(records)}</div>}
        <div id="certificate-container">
          <Certificate
            artworkTitle={formData.artworkTitle}
            artistName={formData.artistName}
            yearOfCompletion={formData.yearOfCompletion}
            dimensions={formData.dimensions}
            editionNumber={formData.editionNumber}
            medium={formData.medium}
            registrationNumber={formData.registrationNumber}
            dateOfCertification="12/21/2025"
            signatureImagePath={testSignature}
            artworkImagePath={testImage}
            markerImagePath={testMarkerImage}
            certificateUrl="https://scan.sign.global/attestation/SPA_wskUuBJlnoH9Bunzoisee"
          />
        </div>
      </div>
    </>
  )
}

export default CertificateForm

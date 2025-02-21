'use client';
import { DivideCircle } from 'lucide-react';
import React, { useState } from 'react';
import { Separator } from "@/components/ui/separator";

const NewProfile: React.FC = () => {
  const [selectedDocument, setSelectedDocument] = useState<string>('');
  const [logoPreview, setLogoPreview] = useState<string | null>(null);
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);

  const handleDocumentChange = (event: React.ChangeEvent<HTMLSelectElement>) => {
    setSelectedDocument(event.target.value);
  };

  const handleLogoChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    if (event.target.files && event.target.files[0]) {
      const file = event.target.files[0];
      setLogoPreview(URL.createObjectURL(file));
    }
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', padding: '50px', height: '100vh' }}>
     <h1 style={{ margin: 0, fontSize:'32px', fontWeight: 'bold' }}>Create Profile</h1>
<Separator className="my-4 border-gray-500 border-1" /> {/* Thicker separator */}

<div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', marginBottom: '20px' }}>
  <div>
    <label htmlFor='logo'>Logo
      <br></br>
      <img style={{ width: '80px', height: '80px', borderRadius: '50%', border: '1px solid #ccc' }} />
    </label>
    <input type='file' id='logo' accept='image/*' onChange={handleLogoChange} required style={{ display: 'none' }} />
  </div>
  
  <div style={{ display: 'flex', justifyContent: 'flex-end', width: '100%' }}>
    <button
      type="submit"
      disabled={isSubmitting}
      style={{
        padding: '10px 20px',
        backgroundColor: '#007bff',
        color: '#fff',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer'
      }}
    >
      {isSubmitting ? 'Submitting...' : 'Save Owner'}
    </button>
  </div>
</div>


     <h2> Profile Informaion</h2>
     <br></br>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(2, 1fr)', gap: '20px', flexGrow: 1 }}>
        <div>
          <label htmlFor='companyName'>Company Name</label>
          <input type='text' name='companyName' id='companyName' placeholder='Enter Company Name' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='ownerName'>Owner Name</label>
          <input type='text' name='ownerName' id='ownerName' placeholder='Enter Owner Name' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='contactNumber'>Contact Number</label>
          <input type='number' name='contactNumber' id='contactNumber' placeholder='Enter Contact Number' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='emailAddress'>Email Address</label>
          <input type='email' name='emailAddress' id='emailAddress' placeholder='Enter Email Address' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='website'>Website</label>
          <input type='text' name='website' id='website' placeholder='Enter Website URL' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='documentType'>Document Type</label>
          <select id='documentType' name='documentType' value={selectedDocument} onChange={handleDocumentChange} required style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option value=''>Select Document Type</option>
            <option value='GST Number'>GST Number</option>
            <option value='UdhyamAadhar Number'>UdhyamAadhar Number</option>
            <option value='State Certificate'>State Certificate</option>
            <option value='Certificate of Incorporation'>Certificate of Incorporation</option>
          </select>
        </div>

        {selectedDocument && (
          <div>
            <label htmlFor={selectedDocument.replace(/\s+/g, '')}>{selectedDocument}</label>
            <input
              type='text'
              name={selectedDocument.replace(/\s+/g, '')}
              id={selectedDocument.replace(/\s+/g, '')}
              placeholder={`Enter ${selectedDocument}`}
              required
              style={{ width: '100%', padding: '10px', marginTop: '5px' }}
            />
          </div>
        )}

        <div>
          <label htmlFor='panNumber'>Pan Number</label>
          <input type='text' name='panNumber' id='panNumber' placeholder='Enter Pan Number' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='companyType'>Company Type</label>
          <input type='text' name='companyType' id='companyType' placeholder='Enter Company Type' required style={{ width: '100%', padding: '10px', marginTop: '5px' }} />
        </div>

        <div>
          <label htmlFor='employeeSize'>Employee Size</label>
          <select name="employeeSize" id="employeeSize" required style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option value="">Select Employee Size</option>
            <option value="1-10">1-10</option>
            <option value="11-50">11-50</option>
            <option value="51-100">51-100</option>
            <option value=">100">&gt;100</option>
          </select>
        </div>

        <div>
          <label htmlFor='businessRegistration'>Business Registration</label>
          <select name="businessRegistration" id="businessRegistration" required style={{ width: '100%', padding: '10px', marginTop: '5px' }}>
            <option value="">Select Business Registration</option>
            <option value="Sole proprietorship">Sole proprietorship</option>
            <option value="One person Company">One person Company</option>
            <option value="Parternship">Parternship</option>
            <option value="Private Limited">Private Limited</option>
          </select>
        </div>

       
      </div>
    </div>
  );
};

export default NewProfile;
import React, { useState } from 'react';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import axios from 'axios';

export default function BrokerBuddy() {
  const [t12File, setT12File] = useState(null);
  const [rentRollFile, setRentRollFile] = useState(null);
  const [valuationOutput, setValuationOutput] = useState('');
  const [bovDraft, setBovDraft] = useState('');
  const [coldEmail, setColdEmail] = useState('');
  const [propertyInfo, setPropertyInfo] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleFileUpload = (e, type) => {
    const file = e.target.files[0];
    if (type === 't12') setT12File(file);
    if (type === 'rentRoll') setRentRollFile(file);
  };

  const generateValuation = async () => {
    if (!t12File || !rentRollFile) {
      alert('Please upload both T12 and Rent Roll files.');
      return;
    }
    setIsLoading(true);
    const formData = new FormData();
    formData.append('t12', t12File);
    formData.append('rentRoll', rentRollFile);
    try {
      const response = await axios.post('/api/valuation', formData);
      setValuationOutput(response.data.valuation);
    } catch (err) {
      setValuationOutput('Error generating valuation.');
    }
    setIsLoading(false);
  };

  const generateBOV = async () => {
    setIsLoading(true);
    try {
      const response = await axios.post('/api/bov', {
        valuation: valuationOutput
      });
      setBovDraft(response.data.bov);
    } catch (err) {
      setBovDraft('Error generating BOV.');
    }
    setIsLoading(false);
  };

  const generateColdEmail = async () => {
    if (!propertyInfo) {
      alert('Please provide property info.');
      return;
    }
    setIsLoading(true);
    try {
      const response = await axios.post('/api/cold-email', {
        property: propertyInfo
      });
      setColdEmail(response.data.email);
    } catch (err) {
      setColdEmail('Error generating email.');
    }
    setIsLoading(false);
  };

  return (
    <div className=\"p-4 grid gap-6 max-w-2xl mx-auto\">
      <h1 className=\"text-2xl font-bold\">BrokerBuddy - AI Assistant for CRE Brokers</h1>

      <Card>
        <CardContent className=\"space-y-4\">
          <h2 className=\"font-semibold text-lg\">📊 Upload Financials</h2>
          <Input type=\"file\" onChange={(e) => handleFileUpload(e, 't12')} />
          <Input type=\"file\" onChange={(e) => handleFileUpload(e, 'rentRoll')} />
          <Button onClick={generateValuation} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Generate Valuation'}
          </Button>
          <Textarea value={valuationOutput} readOnly className=\"min-h-[120px]\" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className=\"space-y-4\">
          <h2 className=\"font-semibold text-lg\">📄 Draft BOV</h2>
          <Button onClick={generateBOV} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Generate BOV Draft'}
          </Button>
          <Textarea value={bovDraft} readOnly className=\"min-h-[120px]\" />
        </CardContent>
      </Card>

      <Card>
        <CardContent className=\"space-y-4\">
          <h2 className=\"font-semibold text-lg\">📧 Cold Email Writer</h2>
          <Input
            value={propertyInfo}
            onChange={(e) => setPropertyInfo(e.target.value)}
            placeholder=\"e.g. 3-unit express wash in Phoenix\"
          />
          <Button onClick={generateColdEmail} disabled={isLoading}>
            {isLoading ? 'Processing...' : 'Generate Email'}
          </Button>
          <Textarea value={coldEmail} readOnly className=\"min-h-[120px]\" />
        </CardContent>
      </Card>
    </div>
  );
}

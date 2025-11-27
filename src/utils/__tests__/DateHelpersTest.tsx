import { getDaysLeft } from '../dateHelpers';

export function DateHelpersTest() {
  const testCases = [
    {
      name: 'Future expiration (30 days from today)',
      date: new Date().toISOString().split('T')[0], // Today's date
      expected: 30
    },
    {
      name: 'Future expiration (subscription from 10 days ago)',
      date: new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expected: 20
    },
    {
      name: 'Expired subscription (from 40 days ago)',
      date: new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0],
      expected: 0
    },
    {
      name: 'Invalid date',
      date: 'invalid-date',
      expected: 0
    },
    {
      name: 'Empty string',
      date: '',
      expected: 0
    }
  ];

  return (
    <div style={{ padding: '20px', fontFamily: 'Arial, sans-serif' }}>
      <h2>getDaysLeft Function Test</h2>
      
      <div style={{ marginBottom: '20px' }}>
        <p><strong>Current Date:</strong> {new Date().toLocaleDateString()}</p>
      </div>

      <table style={{ borderCollapse: 'collapse', width: '100%' }}>
        <thead>
          <tr style={{ backgroundColor: '#f5f5f5' }}>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Test Case</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Input Date</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Expected</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Actual</th>
            <th style={{ border: '1px solid #ddd', padding: '8px', textAlign: 'left' }}>Result</th>
          </tr>
        </thead>
        <tbody>
          {testCases.map((testCase, index) => {
            const actual = getDaysLeft(testCase.date);
            const passed = actual === testCase.expected;
            
            return (
              <tr key={index}>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{testCase.name}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{testCase.date}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{testCase.expected}</td>
                <td style={{ border: '1px solid #ddd', padding: '8px' }}>{actual}</td>
                <td style={{ 
                  border: '1px solid #ddd', 
                  padding: '8px',
                  backgroundColor: passed ? '#d4edda' : '#f8d7da',
                  color: passed ? '#155724' : '#721c24'
                }}>
                  {passed ? '✓ PASS' : '✗ FAIL'}
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>

      <div style={{ marginTop: '20px' }}>
        <h3>Manual Test Examples:</h3>
        <div style={{ backgroundColor: '#f8f9fa', padding: '15px', borderRadius: '5px' }}>
          <p><strong>Today's subscription:</strong> getDaysLeft('{new Date().toISOString().split('T')[0]}') = {getDaysLeft(new Date().toISOString().split('T')[0])}</p>
          <p><strong>10 days ago:</strong> getDaysLeft('{new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}') = {getDaysLeft(new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}</p>
          <p><strong>40 days ago (expired):</strong> getDaysLeft('{new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0]}') = {getDaysLeft(new Date(Date.now() - 40 * 24 * 60 * 60 * 1000).toISOString().split('T')[0])}</p>
        </div>
      </div>
    </div>
  );
}
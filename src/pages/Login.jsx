import React, { useState, useEffect } from 'react';
import { ShieldCheck, Info, Key, Server, ClipboardCheck, Clipboard, AlertCircle } from 'lucide-react';
import { apiService } from '../services/api';
import styles from './Login.module.css';

export default function Login() {
  const [formData, setFormData] = useState({
    companyName: 'goMart',
    ownerName: '',
    rollNo: '',
    ownerEmail: '',
    accessCode: ''
  });

  const [loading, setLoading] = useState(false);
  const [status, setStatus] = useState({ type: '', message: '' });
  const [credentials, setCredentials] = useState(null);
  const [copied, setCopied] = useState(false);

  // Load existing credentials on mount
  useEffect(() => {
    const saved = localStorage.getItem('affordmed_credentials');
    if (saved) {
      const parsed = JSON.parse(saved);
      setCredentials(parsed);
      setFormData(prev => ({
        ...prev,
        companyName: parsed.companyName || 'goMart',
        ownerName: parsed.ownerName || '',
        rollNo: parsed.rollNo || '',
        ownerEmail: parsed.ownerEmail || '',
        accessCode: parsed.accessCode || ''
      }));
    }
  }, []);

  const handleChange = (e) => {
    setFormData(prev => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus({ type: '', message: '' });

    // Validate fields
    if (!formData.companyName || !formData.ownerName || !formData.rollNo || !formData.ownerEmail || !formData.accessCode) {
      setStatus({ type: 'error', message: 'All registration fields are required.' });
      setLoading(false);
      return;
    }

    const res = await apiService.register(formData);
    if (res.success) {
      setCredentials(res.data);
      // Fetch access token immediately using these credentials
      const tokenRes = await apiService.fetchToken(res.data);
      if (tokenRes.success) {
        setStatus({ 
          type: 'success', 
          message: res.simulated 
            ? 'API credentials registered & verified successfully (Simulated mode).' 
            : 'API credentials registered & verified successfully via live server.' 
        });
      } else {
        setStatus({ type: 'warning', message: 'Registered credentials, but failed to retrieve access token.' });
      }
    } else {
      setStatus({ type: 'error', message: 'Failed to register credentials with the test server.' });
    }
    setLoading(false);
  };

  const handleClear = () => {
    localStorage.removeItem('affordmed_credentials');
    localStorage.removeItem('affordmed_token');
    setCredentials(null);
    setStatus({ type: 'success', message: 'Saved credentials and token cleared.' });
    setFormData({
      companyName: 'goMart',
      ownerName: '',
      rollNo: '',
      ownerEmail: '',
      accessCode: ''
    });
  };

  const copyToClipboard = () => {
    if (!credentials) return;
    navigator.clipboard.writeText(JSON.stringify(credentials, null, 2));
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className={`${styles.container} animate-fade-in`}>
      <div className={styles.grid}>
        {/* Left Side: Info and Guidelines */}
        <div className={`glass ${styles.infoCard}`}>
          <div className={styles.header}>
            <Server size={24} className={styles.icon} />
            <h2>API Integration Guidelines</h2>
          </div>
          
          <div className={styles.infoContent}>
            <p>
              This evaluation platform connects to the Affordmed Test E-Commerce Server. You need to obtain credentials to retrieve products in real-time.
            </p>
            
            <div className={styles.alertBox}>
              <Info size={20} className={styles.alertIcon} />
              <p>
                <strong>Automatic Fallback Mode:</strong> If you do not have an active access code or the mock server is offline, the client automatically triggers our deterministic mock database generator. You can still test all sorting, paging, and detailed views.
              </p>
            </div>

            <ul className={styles.steps}>
              <li>
                <strong>Step 1:</strong> Fill out the registration form with your company details.
              </li>
              <li>
                <strong>Step 2:</strong> Submitting the form calls <code>/test/register</code> to get your Client ID and Client Secret.
              </li>
              <li>
                <strong>Step 3:</strong> The app immediately calls <code>/test/auth</code> to fetch a Bearer Access Token.
              </li>
              <li>
                <strong>Step 4:</strong> The retrieved token is saved to authorize all subsequent e-commerce queries.
              </li>
            </ul>
          </div>
        </div>

        {/* Right Side: Form / Credentials display */}
        <div className={`glass ${styles.formCard}`}>
          <h2>API Registration Portal</h2>
          <p className={styles.subtitle}>Enter details to acquire authorization credentials</p>

          {status.message && (
            <div className={`${styles.statusBanner} ${styles[status.type]}`}>
              {status.type === 'error' && <AlertCircle size={18} />}
              {status.type === 'success' && <ShieldCheck size={18} />}
              <span>{status.message}</span>
            </div>
          )}

          <form onSubmit={handleSubmit} className={styles.form}>
            <div className={styles.inputGroup}>
              <label htmlFor="companyName">Company Name</label>
              <input
                type="text"
                id="companyName"
                name="companyName"
                value={formData.companyName}
                onChange={handleChange}
                placeholder="e.g. goMart"
                required
              />
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="ownerName">Owner Name</label>
              <input
                type="text"
                id="ownerName"
                name="ownerName"
                value={formData.ownerName}
                onChange={handleChange}
                placeholder="e.g. Rahul"
                required
              />
            </div>

            <div className={styles.inputRow}>
              <div className={styles.inputGroup}>
                <label htmlFor="rollNo">Roll Number</label>
                <input
                  type="text"
                  id="rollNo"
                  name="rollNo"
                  value={formData.rollNo}
                  onChange={handleChange}
                  placeholder="e.g. 1"
                  required
                />
              </div>

              <div className={styles.inputGroup}>
                <label htmlFor="accessCode">Access Code</label>
                <input
                  type="password"
                  id="accessCode"
                  name="accessCode"
                  value={formData.accessCode}
                  onChange={handleChange}
                  placeholder="Secret Code"
                  required
                />
              </div>
            </div>

            <div className={styles.inputGroup}>
              <label htmlFor="ownerEmail">Owner Email</label>
              <input
                type="email"
                id="ownerEmail"
                name="ownerEmail"
                value={formData.ownerEmail}
                onChange={handleChange}
                placeholder="e.g. rahul@abc.com"
                required
              />
            </div>

            <div className={styles.formActions}>
              <button 
                type="submit" 
                className="premium-btn premium-btn-primary" 
                disabled={loading}
              >
                {loading ? 'Authenticating...' : 'Register & Fetch Token'}
              </button>
              {credentials && (
                <button 
                  type="button" 
                  onClick={handleClear} 
                  className="premium-btn premium-btn-secondary"
                >
                  Clear Keys
                </button>
              )}
            </div>
          </form>

          {/* Credentials Display */}
          {credentials && (
            <div className={styles.credentialsBox}>
              <div className={styles.credentialsHeader}>
                <div className={styles.keyTitle}>
                  <Key size={16} />
                  <h4>Retrieved Keys</h4>
                </div>
                <button 
                  className={styles.copyBtn} 
                  onClick={copyToClipboard}
                  title="Copy keys to clipboard"
                >
                  {copied ? <ClipboardCheck size={16} className={styles.copiedIcon} /> : <Clipboard size={16} />}
                  <span>{copied ? 'Copied!' : 'Copy JSON'}</span>
                </button>
              </div>
              <pre className={styles.jsonBlock}>
                {JSON.stringify({
                  clientID: credentials.clientID,
                  clientSecret: credentials.clientSecret
                }, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

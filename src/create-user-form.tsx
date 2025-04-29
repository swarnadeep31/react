import { useState, useEffect, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

const API_URL = 'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup';
const AUTH_TOKEN = 'YOUR_AUTH_TOKEN_HERE'; // Replace this with your token from challenge-details page

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [validationErrors, setValidationErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState('');

  useEffect(() => {
    const errors = [];

    if (password.length < 10) errors.push('Password must be at least 10 characters long');
    if (password.length > 24) errors.push('Password must be at most 24 characters long');
    if (/\s/.test(password)) errors.push('Password cannot contain spaces');
    if (!/[0-9]/.test(password)) errors.push('Password must contain at least one number');
    if (!/[A-Z]/.test(password)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(password)) errors.push('Password must contain at least one lowercase letter');

    setValidationErrors(errors);
  }, [password]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setApiError('');

    if (!username || validationErrors.length > 0) return;

    try {
      const res = await fetch(API_URL, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${AUTH_TOKEN}`,
        },
        body: JSON.stringify({ username, password }),
      });

      if (res.ok) {
        setUserWasCreated(true);
      } else if (res.status === 400) {
        const data = await res.json();
        if (data.error && data.error.includes('not allowed')) {
          setApiError('Sorry, the entered password is not allowed, please try a different one.');
        } else {
          setApiError('Something went wrong, please try again.');
        }
      } else if (res.status === 401 || res.status === 403) {
        setApiError('Not authenticated to access this resource.');
      } else {
        setApiError('Something went wrong, please try again.');
      }
    } catch {
      setApiError('Something went wrong, please try again.');
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit}>
        <label htmlFor="username" style={formLabel}>Username</label>
        <input
          id="username"
          name="username"
          type="text"
          style={formInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          required
          aria-invalid={!username ? 'true' : 'false'}
        />

        <label htmlFor="password" style={formLabel}>Password</label>
        <input
          id="password"
          name="password"
          type="password"
          style={formInput}
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          required
          aria-invalid={validationErrors.length > 0 ? 'true' : 'false'}
        />

        {validationErrors.length > 0 && (
          <ul style={{ color: 'red', paddingLeft: '20px', margin: 0 }}>
            {validationErrors.map((err, idx) => (
              <li key={idx}>{err}</li>
            ))}
          </ul>
        )}

        {apiError && (
          <div style={{ color: 'red', marginTop: '8px' }}>{apiError}</div>
        )}

        <button type="submit" style={formButton}>Create User</button>
      </form>
    </div>
  );
}

export { CreateUserForm };

// Keep your existing styles unchanged
const formWrapper: CSSProperties = {
  maxWidth: '500px',
  width: '80%',
  backgroundColor: '#efeef5',
  padding: '24px',
  borderRadius: '8px',
};

const form: CSSProperties = {
  display: 'flex',
  flexDirection: 'column',
  gap: '8px',
};

const formLabel: CSSProperties = {
  fontWeight: 700,
};

const formInput: CSSProperties = {
  outline: 'none',
  padding: '8px 16px',
  height: '40px',
  fontSize: '14px',
  backgroundColor: '#f8f7fa',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  borderRadius: '4px',
};

const formButton: CSSProperties = {
  outline: 'none',
  borderRadius: '4px',
  border: '1px solid rgba(0, 0, 0, 0.12)',
  backgroundColor: '#7135d2',
  color: 'white',
  fontSize: '16px',
  fontWeight: 500,
  height: '40px',
  padding: '0 8px',
  display: 'flex',
  alignItems: 'center',
  justifyContent: 'center',
  marginTop: '8px',
  alignSelf: 'flex-end',
  cursor: 'pointer',
};

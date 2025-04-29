import {
  useState,
  useEffect,
  type CSSProperties,
  type Dispatch,
  type SetStateAction,
  FormEvent,
} from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [passwordErrors, setPasswordErrors] = useState<string[]>([]);
  const [apiError, setApiError] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);

  const validatePassword = (pwd: string): string[] => {
    const errors: string[] = [];

    if (pwd.length < 10) errors.push('Password must be at least 10 characters long');
    if (pwd.length > 24) errors.push('Password must be at most 24 characters long');
    if (/\s/.test(pwd)) errors.push('Password cannot contain spaces');
    if (!/\d/.test(pwd)) errors.push('Password must contain at least one number');
    if (!/[A-Z]/.test(pwd)) errors.push('Password must contain at least one uppercase letter');
    if (!/[a-z]/.test(pwd)) errors.push('Password must contain at least one lowercase letter');

    return errors;
  };

  useEffect(() => {
    setPasswordErrors(validatePassword(password));
    setApiError('');
  }, [password]);

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setApiError('');

    const pwdErrors = validatePassword(password);
    if (!username || pwdErrors.length > 0) {
      setPasswordErrors(pwdErrors);
      return;
    }

    setIsSubmitting(true);
    try {
      const res = await fetch(
        'https://api.challenge.hennge.com/password-validation-challenge-api/001/challenge-signup',
        {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: 'Bearer YOUR_AUTH_TOKEN_HERE', // Replace with your actual token
          },
          body: JSON.stringify({ username, password }),
        }
      );

      if (res.ok) {
        setUserWasCreated(true);
      } else if (res.status === 400) {
        const data = await res.json();
        if (
          data.detail &&
          data.detail.toLowerCase().includes('password')
        ) {
          setApiError(
            'Sorry, the entered password is not allowed, please try a different one.'
          );
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
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div style={formWrapper}>
      <form style={form} onSubmit={handleSubmit} noValidate>
        <label htmlFor="username" style={formLabel}>
          Username
        </label>
        <input
          id="username"
          name="username"
          style={formInput}
          value={username}
          onChange={(e) => setUsername(e.target.value)}
          aria-invalid={!username && isSubmitting}
        />

        <label htmlFor="password" style={formLabel}>
          Password
        </label>
        <input
          id="password"
          name="password"
          style={formInput}
          type="password"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
          aria-invalid={passwordErrors.length > 0}
        />

        {/* Password validation errors */}
        {passwordErrors.length > 0 && (
          <ul style={{ color: 'red', margin: '8px 0', paddingLeft: '20px' }}>
            {passwordErrors.map((error, index) => (
              <li key={index}>{error}</li>
            ))}
          </ul>
        )}

        {/* API error message */}
        {apiError && (
          <div style={{ color: 'red', marginTop: '8px' }}>{apiError}</div>
        )}

        <button type="submit" style={formButton} disabled={isSubmitting}>
          {isSubmitting ? 'Submitting...' : 'Create User'}
        </button>
      </form>
    </div>
  );
}

export { CreateUserForm };

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

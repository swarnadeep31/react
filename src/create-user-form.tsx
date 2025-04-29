import { useState, type CSSProperties, type Dispatch, type SetStateAction } from 'react';

interface CreateUserFormProps {
  setUserWasCreated: Dispatch<SetStateAction<boolean>>;
}

function CreateUserForm({ setUserWasCreated }: CreateUserFormProps) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // You can send the username/password to an API here
    console.log('Submitted Username:', username);
    console.log('Submitted Password:', password);

    setUserWasCreated(true);
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
        />

        <button type="submit" style={formButton}>Create User</button>
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

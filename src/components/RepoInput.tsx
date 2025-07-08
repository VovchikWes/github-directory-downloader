import React, { useState } from 'react';

interface RepoInputProps {
  onRepoSubmit: (owner: string, repo: string, path?: string) => void;
}

export const RepoInput: React.FC<RepoInputProps> = ({ onRepoSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const match = input.match(/github\.com\/([^/]+)\/([^/]+)(?:\/tree\/[^/]+\/(.+))?/);

    if (match) {
      const owner = match[1];
      const repo = match[2];
      const path = match[3] || '';
      onRepoSubmit(owner, repo, path);
      setInput(''); 
    } else {
      alert('Введите корректную ссылку на GitHub-репозиторий или папку.');
    }
  };

  return (
    <div style={{ display: 'flex', justifyContent: 'center', marginTop: 20 }}>
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://github.com/user/repo или .../tree/main/src"
        style={{
          width: 450,
          fontSize: 20,
          padding: '14px 16px',
          marginRight: 10,
          borderRadius: 4,
          border: 'none',
          outline: 'none',
          fontWeight: 'bold',
          color: '#4caf50',
          backgroundColor: 'white',
          boxSizing: 'border-box',
          cursor: 'text',
          transition: 'background 0.2s ease',
        }}
      />
      <button
        onClick={handleSubmit}
        style={{
          padding: '14px 20px',
          fontSize: 18,
          fontWeight: 'bold',
          borderRadius: 4,
          border: 'none',
          backgroundColor: 'white',
          color: '#4caf50',
          cursor: 'pointer',
          transition: 'background 0.2s ease',
        }}
        onMouseOver={(e) => (e.currentTarget.style.backgroundColor = '#f0f0f0')}
        onMouseOut={(e) => (e.currentTarget.style.backgroundColor = 'white')}
      >
        Загрузить
      </button>
    </div>
  );
};
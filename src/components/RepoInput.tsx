
import React, { useState } from 'react';

interface RepoInputProps {
  onRepoSubmit: (owner: string, repo: string) => void;
}

export const RepoInput: React.FC<RepoInputProps> = ({ onRepoSubmit }) => {
  const [input, setInput] = useState('');

  const handleSubmit = () => {
    const match = input.match(/github\.com\/([^/]+)\/([^/]+)(\/|$)/);
    if (match) {
      onRepoSubmit(match[1], match[2]);
    } else {
      alert('Введите корректную ссылку на GitHub-репозиторий.');
    }
  };

  return (
    <div>
    <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="https://github.com/user/repo"
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

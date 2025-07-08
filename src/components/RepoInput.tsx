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
   <div className="repo-input-container">
      <input
        value={input}
        onChange={(e) => setInput(e.target.value)}
        placeholder="https://github.com/user/repo или .../tree/main/src"
        className="repo-input"
      />
      <button className="hover-highlight" onClick={handleSubmit}>
        Загрузить
      </button>
    </div>
  );
};
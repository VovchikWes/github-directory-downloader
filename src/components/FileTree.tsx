import React, { useEffect, useState } from 'react';
import { GitHubFile, fetchRepoContent } from '../utils/githubApi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FileTreeProps {
  owner: string;
  repo: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ owner, repo }) => {
  const [tree, setTree] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoot = async () => {
      setLoading(true);
      const files = await fetchRepoContent(owner, repo);
      setTree(files);
      setLoading(false);
    };
    loadRoot();
  }, [owner, repo]);

  const downloadAll = async () => {
    const zip = new JSZip();

    const addToZip = async (path: string, folder: JSZip) => {
      const items = await fetchRepoContent(owner, repo, path);
      for (const item of items) {
        if (item.type === 'file') {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`);
          const data = await res.json();

          if (data.content && data.encoding === 'base64') {
            const decoded = atob(data.content);
            const blob = new Blob([decoded]);
            folder.file(item.name, blob);
          }
        } else if (item.type === 'dir') {
          const subFolder = folder.folder(item.name)!;
          await addToZip(item.path, subFolder);
        }
      }
    };

    await addToZip('', zip);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${repo}.zip`);
  };

  const renderTree = (files: GitHubFile[], level = 0) => (
    <ul className="file-list">
      {files.map((file) => (
        <li
          className="file-item"
          key={file.path}
          style={{ marginLeft: level * 20 }}
        >
          {file.type === 'dir' ? (
            <strong>📁 {file.name}</strong>
          ) : (
            <a
              href={`https://github.com/${owner}/${repo}/blob/main/${file.path}`}
              target="_blank"
              rel="noreferrer"
            >
              📄 {file.name}
            </a>
          )}
        </li>
      ))}
    </ul>
  );

  return (
    <div style={{ marginTop: 20 }}>
      {loading ? (
        <p>Загрузка...</p>
      ) : (
        <div className="file-container">{renderTree(tree)}</div>
      )}
      {tree.length > 0 && (
        <button style={{ marginTop: 20 }} onClick={downloadAll}>
          Скачать всё в ZIP
        </button>
      )}
    </div>
  );
};

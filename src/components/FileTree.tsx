import React, { useEffect, useState } from 'react';
import { GitHubFile, fetchRepoContent } from '../utils/githubApi';
import JSZip from 'jszip';
import { saveAs } from 'file-saver';

interface FileTreeProps {
  owner: string;
  repo: string;
  path?: string;
}

export const FileTree: React.FC<FileTreeProps> = ({ owner, repo, path }) => {
  const [tree, setTree] = useState<GitHubFile[]>([]);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    const loadRoot = async () => {
      setLoading(true);
      const files = await fetchRepoContent(owner, repo, path || '');
      setTree(files);
      setLoading(false);
    };
    loadRoot();
  }, [owner, repo, path]);

  const downloadFile = async (filePath: string, fileName: string) => {
    try {
      const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${filePath}`);
      const data = await res.json();

      if (data.content && data.encoding === 'base64') {
        const decoded = atob(data.content);
        const blob = new Blob([decoded]);
        saveAs(blob, fileName);
      } else {
        alert('Файл не может быть загружен.');
      }
    } catch (err) {
      alert('Ошибка загрузки файла.');
    }
  };

  const downloadFolder = async (folderPath: string, folderName: string) => {
    const zip = new JSZip();
    const folder = zip.folder(folderName)!;

    const addToZip = async (subPath: string, zipFolder: JSZip) => {
      const items = await fetchRepoContent(owner, repo, subPath);
      for (const item of items) {
        if (item.type === 'file') {
          const res = await fetch(`https://api.github.com/repos/${owner}/${repo}/contents/${item.path}`);
          const data = await res.json();
          if (data.content && data.encoding === 'base64') {
            const decoded = atob(data.content);
            const blob = new Blob([decoded]);
            zipFolder.file(item.name, blob);
          }
        } else if (item.type === 'dir') {
          const subFolder = zipFolder.folder(item.name)!;
          await addToZip(item.path, subFolder);
        }
      }
    };

    await addToZip(folderPath, folder);
    const blob = await zip.generateAsync({ type: 'blob' });
    saveAs(blob, `${folderName}.zip`);
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
            <span
              style={{ fontWeight: 'bold', cursor: 'pointer' }}
              onClick={() => downloadFolder(file.path, file.name)}
            >
              📂 {file.name}
            </span>
          ) : (
            <span
              style={{ cursor: 'pointer', textDecoration: 'underline' }}
              onClick={() => downloadFile(file.path, file.name)}
            >
              📃 {file.name}
            </span>
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
        <button style={{ marginTop: 20 }} onClick={() => downloadFolder(path || '', repo)}>
          Скачать всё в ZIP
        </button>
      )}
    </div>
  );
};

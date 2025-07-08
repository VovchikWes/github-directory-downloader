import React, { useState } from "react";
import { RepoInput } from "./components/RepoInput";
import { FileTree } from "./components/FileTree";
import { GithubCorner } from "./components/GithubCorner"; 

const App: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; path?: string } | null>(null);

  return (
    <div>
      <GithubCorner /> 
      <header className="header">No content is hosted on this website. This is a tool to download files from a user-provided GitHub repository URL.</header>
      <h1>GitHub Directory Downloader</h1>
      <RepoInput onRepoSubmit={(owner, repo, path) => setRepoInfo({ owner, repo, path })} />
      {repoInfo && <FileTree owner={repoInfo.owner} repo={repoInfo.repo} path={repoInfo.path} />}
    </div>
  );
};

export default App;

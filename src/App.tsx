import React, { useState } from "react";
import { RepoInput } from "./components/RepoInput";
import { FileTree } from "./components/FileTree";
import { GithubCorner } from "./components/GithubCorner"; 

const App: React.FC = () => {
  const [repoInfo, setRepoInfo] = useState<{ owner: string; repo: string; path?: string } | null>(null);

  return (
    <div>
      <GithubCorner /> 

      <h1>GitHub Directory Downloader</h1>
      <RepoInput onRepoSubmit={(owner, repo, path) => setRepoInfo({ owner, repo, path })} />
      {repoInfo && <FileTree owner={repoInfo.owner} repo={repoInfo.repo} path={repoInfo.path} />}
    </div>
  );
};

export default App;

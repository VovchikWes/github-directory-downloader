
import axios from 'axios';

export interface GitHubFile {
  name: string;
  path: string;
  type: 'file' | 'dir';
  download_url: string | null;
}

export const fetchRepoContent = async (
  owner: string,
  repo: string,
  path = ''
): Promise<GitHubFile[]> => {
  const res = await axios.get(
    `https://api.github.com/repos/${owner}/${repo}/contents/${path}`
  );
  return res.data;
};

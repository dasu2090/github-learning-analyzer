export async function fetchUserRepos(accessToken: string) {
  const res = await fetch('https://api.github.com/user/repos?per_page=100', {
    headers: {
      Authorization: `Bearer ${accessToken}`,
      Accept: 'application/vnd.github+json',
    },
  });

  if (!res.ok) {
    throw new Error('GitHub APIからリポジトリを取得できませんでした。');
  }

  return await res.json();
}

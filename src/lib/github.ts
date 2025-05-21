// src/lib/github.ts
export async function fetchContributionCalendar(accessToken: string) {
  const query = `
    query {
      viewer {
        contributionsCollection {
          contributionCalendar {
            weeks {
              contributionDays {
                date
                contributionCount
                color
              }
            }
          }
        }
      }
    }
  `;

  const res = await fetch('https://api.github.com/graphql', {
    method: 'POST',
    headers: {
      Authorization: `Bearer ${accessToken}`,
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({ query }),
  });

  const json = await res.json();
  const daysRaw = json.data.viewer.contributionsCollection.contributionCalendar.weeks
    .flatMap((week: any) => week.contributionDays);

  const normalized = daysRaw.map((day: any) => ({
    date: day.date,
    count: day.contributionCount,
    level: getLevel(day.contributionCount),
  }));

  return normalized;
}

// GitHubと同じような色レベル（0〜4）
function getLevel(count: number): number {
  if (count === 0) return 0;
  if (count < 5) return 1;
  if (count < 10) return 2;
  if (count < 20) return 3;
  return 4;
}

export async function fetchLanguagesForAllRepos(token: string, repos: any[]) {
  const headers = {
    Authorization: `Bearer ${token}`,
    Accept: 'application/vnd.github+json',
  };

  const languageMap: Record<string, number> = {};

  for (const repo of repos) {
    const res = await fetch(repo.languages_url, { headers });
    const data = await res.json();

    for (const [lang, bytes] of Object.entries(data)) {
      languageMap[lang] = (languageMap[lang] || 0) + (bytes as number);
    }
  }

  return languageMap;
}

// Receives the "Start a conversation" contact form and commits each
// submission as a JSON file in /submissions so it shows up in the
// Decap CMS admin panel (Content -> Form Submissions).
//
// Requires these Netlify environment variables (Site settings -> Environment variables):
//   GITHUB_TOKEN       - a GitHub personal access token with write access to the repo
//   GITHUB_REPO_OWNER  - e.g. "dara-forwardcollective"
//   GITHUB_REPO_NAME   - e.g. "forward-collective"
//   GITHUB_BRANCH      - optional, defaults to "main"

exports.handler = async function (event) {
  if (event.httpMethod !== 'POST') {
    return { statusCode: 405, body: 'Method Not Allowed' };
  }

  let data;
  try {
    data = JSON.parse(event.body || '{}');
  } catch (e) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Invalid JSON' }) };
  }

  const name = (data.name || '').trim();
  const business = (data.business || '').trim();
  const email = (data.email || '').trim();
  const phone = (data.phone || '').trim();
  const website = (data.website || '').trim();
  const about = (data.about || '').trim();
  const goal = (data.goal || '').trim();

  if (!name || !email || !business || !about || !goal) {
    return { statusCode: 400, body: JSON.stringify({ error: 'Missing required fields' }) };
  }

  const owner = process.env.GITHUB_REPO_OWNER;
  const repo = process.env.GITHUB_REPO_NAME;
  const branch = process.env.GITHUB_BRANCH || 'main';
  const token = process.env.GITHUB_TOKEN;

  if (!owner || !repo || !token) {
    console.error('Missing GITHUB_REPO_OWNER, GITHUB_REPO_NAME, or GITHUB_TOKEN env vars');
    return { statusCode: 500, body: JSON.stringify({ error: 'Server not configured' }) };
  }

  const submittedAt = new Date().toISOString();
  const slugSource = `${submittedAt}-${name}`.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '');
  const filename = `submissions/${slugSource}.json`;

  const record = { name, business, email, phone, website, about, goal, submittedAt };
  const contentBase64 = Buffer.from(JSON.stringify(record, null, 2), 'utf-8').toString('base64');

  try {
    const res = await fetch(
      `https://api.github.com/repos/${owner}/${repo}/contents/${encodeURIComponent(filename)}`,
      {
        method: 'PUT',
        headers: {
          Authorization: `token ${token}`,
          'Content-Type': 'application/json',
          'User-Agent': 'forward-collective-site',
          Accept: 'application/vnd.github+json'
        },
        body: JSON.stringify({
          message: `New inquiry: ${name} (${business})`,
          content: contentBase64,
          branch
        })
      }
    );

    if (!res.ok) {
      const detail = await res.text();
      console.error('GitHub API error:', res.status, detail);
      return { statusCode: 502, body: JSON.stringify({ error: 'Could not save submission' }) };
    }

    return { statusCode: 200, body: JSON.stringify({ success: true }) };
  } catch (err) {
    console.error('submit-inquiry error:', err);
    return { statusCode: 500, body: JSON.stringify({ error: 'Unexpected server error' }) };
  }
};

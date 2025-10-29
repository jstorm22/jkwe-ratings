export default async function handler(req, res) {
  try {
    if (req.method !== 'GET') {
      return res.status(405).json({ error: 'Method not allowed' });
    }

    const {
      GH_TOKEN,
      GH_OWNER,
      GH_REPO,
      GH_BRANCH = 'main',
      GH_MOVIES_PATH = 'data/movies.json',
      GH_SITE_PATH = 'data/site.json',
    } = process.env;

    const ghBase = `https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents`;

    async function getFile(path) {
      const r = await fetch(`${ghBase}/${encodeURIComponent(path)}?ref=${GH_BRANCH}`, {
        headers: { Authorization: `Bearer ${GH_TOKEN}`, 'Accept': 'application/vnd.github+json' }
      });
      if (r.status === 404) return { data: null, sha: null }; // not created yet
      if (!r.ok) throw new Error(`GitHub GET ${path} failed: ${r.status}`);
      const j = await r.json();
      const data = JSON.parse(Buffer.from(j.content, 'base64').toString('utf8'));
      return { data, sha: j.sha };
    }

    const [movies, site] = await Promise.all([getFile(GH_MOVIES_PATH), getFile(GH_SITE_PATH)]);

    return res.status(200).json({
      ok: true,
      movies: movies.data || [],
      site: site.data || { podcastEmbed: '', editPassword: 'sage42' },
      shas: { movies: movies.sha, site: site.sha },
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

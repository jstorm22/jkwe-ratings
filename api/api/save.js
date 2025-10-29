export const config = { api: { bodyParser: true } };

export default async function handler(req, res) {
  try {
    if (req.method !== 'POST') {
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

    const { movies, site, shas } = req.body || {};
    if (!movies || !site) return res.status(400).json({ ok: false, error: 'Missing payload' });

    const ghPut = async (path, contentObj, prevSha) => {
      const r = await fetch(`https://api.github.com/repos/${GH_OWNER}/${GH_REPO}/contents/${encodeURIComponent(path)}`, {
        method: 'PUT',
        headers: {
          Authorization: `Bearer ${GH_TOKEN}`,
          'Accept': 'application/vnd.github+json',
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          message: `Update ${path} via site`,
          content: Buffer.from(JSON.stringify(contentObj, null, 2), 'utf8').toString('base64'),
          branch: GH_BRANCH,
          sha: prevSha || undefined
        })
      });
      if (!r.ok) {
        const t = await r.text();
        throw new Error(`GitHub PUT ${path} failed: ${r.status} ${t}`);
      }
      return r.json();
    };

    const [mResp, sResp] = await Promise.all([
      ghPut(GH_MOVIES_PATH, movies, shas?.movies),
      ghPut(GH_SITE_PATH, site, shas?.site),
    ]);

    return res.status(200).json({
      ok: true,
      newShas: { movies: mResp.content.sha, site: sResp.content.sha }
    });
  } catch (err) {
    return res.status(500).json({ ok: false, error: String(err) });
  }
}

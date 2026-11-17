/** Forwards a submission to Web3Forms. The access key lives in the WEB3FORMS_ACCESS_KEY environment variable. */
export async function forwardToWeb3Forms(subject: string, fields: Record<string, string>): Promise<boolean> {
  const key = process.env.WEB3FORMS_ACCESS_KEY;
  if (!key) return false;
  try {
    const res = await fetch('https://api.web3forms.com/submit', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ access_key: key, subject, from_name: 'Felibest Plumbing website', ...fields }),
      signal: AbortSignal.timeout(8000),
    });
    return res.ok;
  } catch {
    return false;
  }
}

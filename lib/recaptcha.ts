/**
 * Verify a Google reCAPTCHA v3 token. Returns true when:
 *  - reCAPTCHA is not configured (dev convenience)
 *  - or Google verifies the token AND score >= threshold (default 0.5)
 */
export async function verifyRecaptcha(token: string | undefined): Promise<{
  ok: boolean;
  score?: number;
  reason?: string;
}> {
  const secret = process.env.RECAPTCHA_SECRET_KEY;
  if (!secret) return { ok: true, reason: 'recaptcha-not-configured' };
  if (!token) return { ok: false, reason: 'missing-token' };

  try {
    const params = new URLSearchParams();
    params.append('secret', secret);
    params.append('response', token);

    const res = await fetch('https://www.google.com/recaptcha/api/siteverify', {
      method: 'POST',
      headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
      body: params.toString(),
      cache: 'no-store',
    });

    const data: {
      success: boolean;
      score?: number;
      action?: string;
      'error-codes'?: string[];
    } = await res.json();

    if (!data.success) {
      return { ok: false, reason: data['error-codes']?.join(',') || 'failed' };
    }
    const score = typeof data.score === 'number' ? data.score : 1;
    return { ok: score >= 0.5, score };
  } catch (err) {
    return { ok: false, reason: 'network-error' };
  }
}

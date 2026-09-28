import 'server-only'
const ENABLED = process.env.NOTIFICATIONS_ENABLED === 'true'

type SubmissionType =
  | 'contact-message'
  | 'quote-request'
  | 'test-drive-booking'
  | 'newsletter-subscribe'

export async function notifyNewSubmission(
  type: SubmissionType,
  payload: Record<string, unknown>,
): Promise<void> {
  if (!ENABLED) {
    console.log(
      `[notifications:noop] ${type} — NOTIFICATIONS_ENABLED is off or unset.`,
    )
    return
  }

  try {
    // Extension point: integrate your email/SMS/Slack provider here.
    // Example:
    //   await fetch('https://hooks.slack.com/services/...', {
    //     method: 'POST',
    //     body: JSON.stringify({ type, payload }),
    //   })
    console.warn(
      `[notifications:unconfigured] ${type} submission received, but no provider is wired. Implement the handler above or set NOTIFICATIONS_ENABLED=false to silence. payload=`,
      payload,
    )
  } catch (err) {
    console.error(
      `[notifications:error] ${type} handler threw — swallowing so the public route still returns 2xx to the user. err=`,
      err,
    )
  }
}

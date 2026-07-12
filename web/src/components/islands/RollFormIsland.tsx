import { useState } from 'react'
import './roll-form.css'

/**
 * RollFormIsland (v10) — the Founding Roll enrollment form, the site's first
 * public transaction (catalog 1.3; v5 numbered-roll design). Posts to the
 * same-origin Astro endpoint /api/roll, which forwards to the Payload
 * founding-roll collection. No third-party requests; no payment; the number
 * comes back and is shown to the enrollee.
 *
 * The `website` field is a honeypot: visually hidden, must stay empty.
 */

type Phase = 'idle' | 'sending' | 'done' | 'error'

export default function RollFormIsland(props: { submitLabel: string; successNote: string; source: string }) {
  const [phase, setPhase] = useState<Phase>('idle')
  const [rollNumber, setRollNumber] = useState<number | null>(null)
  const [error, setError] = useState('')

  async function onSubmit(e: React.FormEvent<HTMLFormElement>) {
    e.preventDefault()
    if (phase === 'sending') return
    const form = e.currentTarget
    const data = Object.fromEntries(new FormData(form).entries())
    setPhase('sending')
    setError('')
    try {
      const res = await fetch('/api/roll', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ ...data, consent: data.consent === 'on', source: props.source }),
      })
      const json = await res.json().catch(() => ({}))
      if (!res.ok) {
        setError(typeof json.error === 'string' ? json.error : 'The roll could not take the name. Try again.')
        setPhase('error')
        return
      }
      setRollNumber(typeof json.rollNumber === 'number' ? json.rollNumber : null)
      setPhase('done')
      form.reset()
    } catch {
      setError('The roll could not be reached. Try again in a moment.')
      setPhase('error')
    }
  }

  if (phase === 'done') {
    return (
      <p className="v9-roll__done" role="status">
        {props.successNote}
        {rollNumber != null && (
          <>
            {' '}
            <strong className="v9-roll__number">No. {rollNumber}</strong>
          </>
        )}
      </p>
    )
  }

  return (
    <form className="v9-roll__form" onSubmit={onSubmit} aria-label="Join the Founding Roll">
      <div className="v9-roll__row">
        <label className="v9-roll__field">
          <span className="v9-roll__label">Name on the roll</span>
          <input className="v9-roll__input" name="name" type="text" required maxLength={120} autoComplete="name" />
        </label>
        <label className="v9-roll__field">
          <span className="v9-roll__label">Email</span>
          <input className="v9-roll__input" name="email" type="email" required autoComplete="email" />
        </label>
      </div>
      <label className="v9-roll__field">
        <span className="v9-roll__label">A note to the writer (optional)</span>
        <textarea className="v9-roll__input v9-roll__input--note" name="note" maxLength={500} rows={2} />
      </label>
      <label className="v9-roll__hp" aria-hidden="true" tabIndex={-1}>
        Leave this field empty
        <input name="website" type="text" tabIndex={-1} autoComplete="off" />
      </label>
      <label className="v9-roll__consent">
        <input name="consent" type="checkbox" required />
        <span>Name me on the roll and send word when the work ships.</span>
      </label>
      {phase === 'error' && (
        <p className="v9-roll__error" role="alert">
          {error}
        </p>
      )}
      <button className="v9-btn v9-roll__submit" type="submit" disabled={phase === 'sending'}>
        {phase === 'sending' ? 'Taking your number…' : props.submitLabel}
      </button>
    </form>
  )
}

import { useEffect, useRef, useState } from 'react'
import { DEMO_FIELDS, DEMO_FORM } from '../../data/bookDemo'

// Demo form — specs/book-a-demo.md §2 (right column) + §3 (states). Webflow default form
// styles, no custom classes (styles: DEMO FORM block in src/styles/page-book-a-demo.css).
// Never submits (DEVIATIONS D2): native required/email validation (Chromium messages
// "Please fill out this field." / "Please include an '@' …", first invalid field focused),
// then a brief "Submitting..." (button disabled), then the Webflow `.w-form-done` block,
// shown and focused. The live HubSpot `redirectUri` is unknown (spec §9.1), so none is used.
// Omitted on purpose: honeypot `website_url`, the 1500ms bot guard, Finsweet selectcustom,
// the ms-code-dropdown-redirect scripts and the dead `#t9-hubspot-form` CSS (spec §4).
//
// QA hook (this page only): `?form=success` or `?form=error` renders that state on load,
// because neither can be reached over the network. States: data-state on `.w-form`.
const FORM_STATES = ['default', 'submitting', 'success', 'error']

function readFormParam() {
  if (typeof window === 'undefined') return 'default'
  const p = new URLSearchParams(window.location.search).get('form')
  return p === 'success' || p === 'error' ? p : 'default'
}

export default function DemoForm() {
  const [state, setState] = useState(readFormParam)
  const doneRef = useRef(null)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])
  useEffect(() => {
    if (state === 'success') doneRef.current?.focus()
  }, [state])

  const onSubmit = (e) => {
    e.preventDefault()
    const form = e.currentTarget
    if (!form.checkValidity()) {
      form.reportValidity()
      return
    }
    setState('submitting')
    timer.current = setTimeout(() => setState('success'), DEMO_FORM.submittingMs)
  }

  const submitting = state === 'submitting'
  return (
    <div className="w-form" data-component="demo-form" data-state={FORM_STATES.includes(state) ? state : 'default'}>
      {state !== 'success' && (
        <form
          id={DEMO_FORM.id}
          name={DEMO_FORM.name}
          data-name={DEMO_FORM.dataName}
          method="get"
          aria-label={DEMO_FORM.dataName}
          className="demo-form"
          onSubmit={onSubmit}
        >
          {DEMO_FIELDS.map((f) => (
            <FieldPair key={f.id} field={f} />
          ))}
          {/* MOTION: none — no hover change on the button (measured). */}
          <input
            type="submit"
            className="w-button"
            data-wait={DEMO_FORM.dataWait}
            value={submitting ? DEMO_FORM.submitting : DEMO_FORM.submit}
            disabled={submitting}
          />
        </form>
      )}
      <div
        ref={doneRef}
        className={`w-form-done${state === 'success' ? ' is-shown' : ''}`}
        role="region"
        aria-label={`${DEMO_FORM.dataName} success`}
        tabIndex={-1}
      >
        <div>{DEMO_FORM.success}</div>
      </div>
      <div
        className={`w-form-fail${state === 'error' ? ' is-shown' : ''}`}
        role="region"
        aria-label={`${DEMO_FORM.dataName} failure`}
      >
        <div>{DEMO_FORM.fail}</div>
      </div>
    </div>
  )
}

function FieldPair({ field }) {
  return (
    <>
      <label htmlFor={field.id}>{field.label}</label>
      {/* MOTION: BAD-M2 — :focus border #ccc -> #3898ec, instant (CSS). */}
      <input
        className="w-input"
        maxLength={256}
        name={field.id}
        data-name={field.id}
        placeholder={field.placeholder}
        type={field.type}
        id={field.id}
        required
      />
    </>
  )
}

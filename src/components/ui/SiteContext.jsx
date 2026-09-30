import { createContext, useCallback, useContext, useMemo, useState } from 'react'

// Page-level shared state:
// - phone: the hero, CTA (#input-footer-phone) and popup phone inputs are value-synced
//   on `input` (CLONE_SPEC §4 "Interactions").
// - popup: "Call Alex" modal open flag + form state ('default' | 'success' | 'error').
//
// QA hook: `?popup=open|success|error` opens the popup on load in that state, so the
// success/error states (which can never be reached without a network) can be audited.
const SiteContext = createContext(null)

const POPUP_STATES = ['default', 'success', 'error']

function readPopupParam() {
  if (typeof window === 'undefined') return null
  return new URLSearchParams(window.location.search).get('popup')
}

export function SiteProvider({ children }) {
  const param = readPopupParam()
  const [phone, setPhone] = useState('')
  const [popupOpen, setPopupOpen] = useState(param !== null)
  const [popupState, setPopupState] = useState(POPUP_STATES.includes(param) ? param : 'default')

  const openPopup = useCallback(() => setPopupOpen(true), [])
  const closePopup = useCallback(() => setPopupOpen(false), [])

  const value = useMemo(
    () => ({ phone, setPhone, popupOpen, openPopup, closePopup, popupState, setPopupState }),
    [phone, popupOpen, openPopup, closePopup, popupState],
  )
  return <SiteContext.Provider value={value}>{children}</SiteContext.Provider>
}

export function useSite() {
  const ctx = useContext(SiteContext)
  if (!ctx) throw new Error('useSite must be used inside <SiteProvider>')
  return ctx
}

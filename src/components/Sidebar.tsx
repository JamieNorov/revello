'use client'
import Link from 'next/link'
import { usePathname } from 'next/navigation'

const nav = [
  { href: '/dashboard/welcome', label: 'Welcome', icon: 'home' },
  { href: '/dashboard/activity-log', label: 'Activity Log', icon: 'activity' },
  { href: '/dashboard/website-editor', label: 'Website Editor', icon: 'edit' },
  { href: '/dashboard/practice-growth', label: 'Practice Growth', icon: 'users' },
  { href: '/dashboard/website-performance', label: 'Website Performance', icon: 'globe' },
  { href: '/dashboard/search-authority', label: 'Search & Authority', icon: 'search' },
  { href: '/dashboard/google-ads', label: 'Google Ads', icon: 'google' },
  { href: '/dashboard/meta-ads', label: 'Meta Ads', icon: 'meta' },
  { href: '/dashboard/campaign-launcher', label: 'Campaign Launcher', icon: 'rocket' },
  { href: '/dashboard/competitor-tracking', label: 'Competitor Tracking', icon: 'eye' },
  { href: '/dashboard/crm', label: 'CRM', icon: 'pipeline' },
]

const footerActions = [
  { label: 'Switch Location', icon: 'switch' },
  { label: 'Support', icon: 'support' },
  { label: 'Notifications', icon: 'bell', badge: '3' },
  { label: 'Settings', icon: 'settings' },
]

const icons: Record<string, JSX.Element> = {
  home: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z"/><polyline points="9 22 9 12 15 12 15 22"/></svg>,
  activity: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><polyline points="22 12 18 12 15 21 9 3 6 12 2 12"/></svg>,
  edit: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/><path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/></svg>,
  users: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87"/><path d="M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  globe: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><line x1="2" y1="12" x2="22" y2="12"/><path d="M12 2a15.3 15.3 0 0 1 4 10 15.3 15.3 0 0 1-4 10 15.3 15.3 0 0 1-4-10 15.3 15.3 0 0 1 4-10z"/></svg>,
  search: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="11" cy="11" r="8"/><line x1="21" y1="21" x2="16.65" y2="16.65"/></svg>,
  google: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M21.8 10H12v4h5.6C16.8 16.4 14.6 18 12 18c-3.3 0-6-2.7-6-6s2.7-6 6-6c1.5 0 2.9.6 4 1.5L19 4.5C17.1 2.9 14.7 2 12 2 6.5 2 2 6.5 2 12s4.5 10 10 10c5.5 0 10-4.5 10-10 0-.7-.1-1.3-.2-2z"/></svg>,
  meta: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>,
  rocket: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M4.5 16.5c-1.5 1.26-2 5-2 5s3.74-.5 5-2c.71-.84.7-2.13-.09-2.91a2.18 2.18 0 0 0-2.91-.09z"/><path d="m12 15-3-3a22 22 0 0 1 2-3.95A12.88 12.88 0 0 1 22 2c0 2.72-.78 7.5-6 11a22.35 22.35 0 0 1-4 2z"/><path d="M9 12H4s.55-3.03 2-4c1.62-1.08 5 0 5 0"/><path d="M12 15v5s3.03-.55 4-2c1.08-1.62 0-5 0-5"/></svg>,
  eye: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M1 12s4-8 11-8 11 8 11 8-4 8-11 8-11-8-11-8z"/><circle cx="12" cy="12" r="3"/></svg>,
  pipeline: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><rect x="3" y="3" width="18" height="18" rx="2"/><path d="M3 9h18M3 15h18M9 3v18"/></svg>,
  switch: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/><circle cx="9" cy="7" r="4"/><path d="M23 21v-2a4 4 0 0 0-3-3.87M16 3.13a4 4 0 0 1 0 7.75"/></svg>,
  support: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="10"/><path d="M9.09 9a3 3 0 0 1 5.83 1c0 2-3 3-3 3"/><line x1="12" y1="17" x2="12.01" y2="17"/></svg>,
  bell: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M18 8A6 6 0 0 0 6 8c0 7-3 9-3 9h18s-3-2-3-9"/><path d="M13.73 21a2 2 0 0 1-3.46 0"/></svg>,
  settings: <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><circle cx="12" cy="12" r="3"/><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1-2.83 2.83l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-4 0v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83-2.83l.06-.06A1.65 1.65 0 0 0 4.68 15a1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1 0-4h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 2.83-2.83l.06.06A1.65 1.65 0 0 0 9 4.68a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 4 0v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 2.83l-.06.06A1.65 1.65 0 0 0 19.4 9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 0 4h-.09a1.65 1.65 0 0 0-1.51 1z"/></svg>,
}

export default function Sidebar() {
  const pathname = usePathname()

  return (
    <aside className="sidebar" id="sidebar">
      <div className="brand">
        <div className="brand-mark"><span/><span/><span/></div>
        <div><strong>NOVA</strong><small>Dental OS</small></div>
      </div>

      <button className="practice-switcher" title="Northstar Dental">
        <div className="practice-avatar">RD</div>
        <span><small>Practice</small><strong>Northstar Dental</strong></span>
        <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"><path d="M7 15l5 5 5-5"/><path d="M7 9l5-5 5 5"/></svg>
      </button>

      <nav>
        <p>Workspace</p>
        {nav.map(item => (
          <Link
            key={item.href}
            href={item.href}
            className={`nav-link${pathname === item.href || pathname.startsWith(item.href + '/') ? ' active' : ''}`}
            title={item.label}
          >
            {icons[item.icon]}
            <span>{item.label}</span>
          </Link>
        ))}
        {footerActions.map(item => (
          <button key={item.label} className="nav-link" title={item.label}>
            {icons[item.icon]}
            <span>{item.label}</span>
            {item.badge && <b className="nav-badge">{item.badge}</b>}
          </button>
        ))}
      </nav>

      <div className="sidebar-foot">
        <div className="system-status"><span/><div><strong>All systems active</strong><small>Last sync 2 min ago</small></div></div>
        <button className="user-button" title="Jamie Norov">
          <span className="avatar">JN</span>
          <span><strong>Jamie Norov</strong><small>sceneryimage@gmail.com</small></span>
        </button>
      </div>
    </aside>
  )
}

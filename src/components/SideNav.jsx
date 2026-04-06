import React, { useState } from 'react'

export default function SideNav() {
  const [myBookOpen, setMyBookOpen] = useState(true)

  return (
    <div className="w-60 flex-shrink-0 flex flex-col" style={{ backgroundColor: '#000000' }}>
      {/* Logo */}
      <div className="flex items-center px-6 py-4 border-b border-white/10">
        <img src="/logo.png" alt="SecondSight" className="h-7 object-contain" />
      </div>

      {/* Nav */}
      <nav className="flex-1 py-2">
        {/* My Book */}
        <div>
          <button
            onClick={() => setMyBookOpen(!myBookOpen)}
            className="w-full flex items-center justify-between px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors"
          >
            <div className="flex items-center gap-2.5">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                <path d="M3 9l9-7 9 7v11a2 2 0 01-2 2H5a2 2 0 01-2-2z" />
                <polyline points="9 22 9 12 15 12 15 22" />
              </svg>
              <span className="text-sm font-medium">My Book</span>
            </div>
            <svg
              width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2"
              className={`transition-transform ${myBookOpen ? 'rotate-180' : ''}`}
            >
              <polyline points="6 9 12 15 18 9" />
            </svg>
          </button>

          {myBookOpen && (
            <div className="ml-2">
              <a
                href="#"
                className="flex items-center px-4 py-2 mx-2 rounded text-white text-sm font-medium"
                style={{ backgroundColor: 'rgba(255,255,255,0.15)' }}
              >
                Customers
              </a>
            </div>
          )}
        </div>

        {/* Team */}
        <div className="mt-1">
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <path d="M17 21v-2a4 4 0 00-4-4H5a4 4 0 00-4 4v2" />
              <circle cx="9" cy="7" r="4" />
              <path d="M23 21v-2a4 4 0 00-3-3.87" />
              <path d="M16 3.13a4 4 0 010 7.75" />
            </svg>
            <span className="text-sm font-medium">Team</span>
          </button>
          <div className="ml-2">
            <a href="#" className="flex items-center px-4 py-1.5 mx-2 text-white/60 text-sm hover:text-white/90 transition-colors">Management</a>
            <a href="#" className="flex items-center px-4 py-1.5 mx-2 text-white/60 text-sm hover:text-white/90 transition-colors">Invite Colleague</a>
          </div>
        </div>

        {/* Carrier Settings */}
        <div className="mt-1">
          <button className="w-full flex items-center gap-2.5 px-4 py-2.5 text-white/80 hover:text-white hover:bg-white/10 transition-colors">
            <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <rect x="3" y="3" width="7" height="7" rx="1" />
              <rect x="14" y="3" width="7" height="7" rx="1" />
              <rect x="3" y="14" width="7" height="7" rx="1" />
              <rect x="14" y="14" width="7" height="7" rx="1" />
            </svg>
            <span className="text-sm font-medium">Carrier Settings</span>
          </button>
        </div>
      </nav>

      {/* Footer */}
      <div className="px-4 py-3 border-t border-white/10">
        <p className="text-white/40 text-[10px]">Version 2.27.22</p>
        <div className="flex gap-2 mt-0.5">
          <a href="#" className="text-white/40 text-[10px] underline hover:text-white/70">Terms & Conditions</a>
          <span className="text-white/30 text-[10px]">—</span>
          <a href="#" className="text-white/40 text-[10px] underline hover:text-white/70">Privacy Policy</a>
        </div>
        <p className="text-white/30 text-[10px] mt-0.5">© 2026 SecondSight. All rights reserved.</p>
      </div>
    </div>
  )
}

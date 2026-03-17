import type { ReactNode } from 'react'
import { TopBar } from './TopBar'
import { Sidebar } from './Sidebar'
import { MailList } from './MailList'

interface Props {
  children: ReactNode
}

export function AppShell({ children }: Props) {
  return (
    <div className="flex h-screen flex-col bg-white">
      <TopBar />
      <div className="flex flex-1 overflow-hidden">
        <Sidebar />
        <MailList />
        <main className="flex-1 overflow-y-auto bg-slate-50">{children}</main>
      </div>
    </div>
  )
}

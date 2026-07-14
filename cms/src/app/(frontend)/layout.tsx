import React from 'react'
import './styles.css'

export const metadata = {
  description: 'APR 70 Pictures CMS. Internal debug surface; the admin lives at /admin.',
  title: 'APR 70 CMS',
}

export default async function RootLayout(props: { children: React.ReactNode }) {
  const { children } = props

  return (
    <html lang="en">
      <body>
        <main>{children}</main>
      </body>
    </html>
  )
}

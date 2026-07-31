import localFont from 'next/font/local'
import { Bricolage_Grotesque, Syne } from 'next/font/google'

export const funnelDisplay = localFont({
  src: './font/funnel-display/FunnelDisplay-VariableFont_wght.ttf',
  weight: '300 800',
  style: 'normal',
  display: 'swap',
})

export const bricolageGrotesque = Bricolage_Grotesque({
  subsets: ['latin'],
  variable: '--font-heading',
  display: 'swap',
})

export const syne = Syne({
  subsets: ['latin'],
  variable: '--font-body',
  display: 'swap',
})

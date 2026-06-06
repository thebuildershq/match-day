import { type ReactNode } from 'react'
import { Container } from '../ui/Container'

export function Footer() {
  return (
    <footer className="py-16 md:py-20 border-t border-line/60 bg-canvas">
      <Container>
        <div className="grid md:grid-cols-[2fr_1fr_1fr_1fr] gap-12 mb-12">
          <div>
            <a href="/" className="flex items-center gap-2 mb-3">
              <div className="w-7 h-7 bg-ink rounded-md flex items-center justify-center">
                <span className="text-canvas text-sm font-bold">S</span>
              </div>
              <span className="font-semibold text-ink tracking-tight">Scorepact</span>
            </a>
            <p className="text-sm text-muted max-w-xs leading-relaxed">
              Private football prediction pools. For the rivalry, not the money.
            </p>
          </div>

          <FooterCol title="Product">
            <FooterLink href="#how">How it works</FooterLink>
            <FooterLink href="#predict">Try it</FooterLink>
          </FooterCol>

          <FooterCol title="Company">
            <FooterLink href="#">About</FooterLink>
            <FooterLink href="#">Contact</FooterLink>
          </FooterCol>

          <FooterCol title="Legal">
            <FooterLink href="#">Privacy</FooterLink>
            <FooterLink href="#">Terms</FooterLink>
          </FooterCol>
        </div>

        <div className="pt-8 border-t border-line/60 flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div className="text-sm text-muted">© 2026 Scorepact. All rights reserved.</div>
          <div className="text-sm text-muted">Made for football fans.</div>
        </div>
      </Container>
    </footer>
  )
}

function FooterCol({ title, children }: { title: string; children: ReactNode }) {
  return (
    <div>
      <h4 className="text-xs uppercase tracking-wider text-muted font-medium mb-4">{title}</h4>
      <ul className="space-y-3">{children}</ul>
    </div>
  )
}

function FooterLink({ href, children }: { href: string; children: ReactNode }) {
  return (
    <li>
      <a href={href} className="text-sm text-ink hover:text-accent transition-colors">
        {children}
      </a>
    </li>
  )
}
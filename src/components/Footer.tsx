export function Footer() {
  return (
    <footer className="bg-secondary border-t border-border mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="text-center space-y-2">
          <p className="text-sm text-muted-foreground">
            Copyright © 2021 Polymer Bionics Limited. All rights reserved
          </p>
          <p className="text-sm text-muted-foreground">
            <a 
              href="mailto:info@polymerbionics.com" 
              className="hover:text-primary transition-colors"
            >
              info@polymerbionics.com
            </a>
          </p>
        </div>
      </div>
    </footer>
  )
}

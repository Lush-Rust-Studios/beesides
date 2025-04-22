import Link from "next/link";

export function Footer() {
  return (
    <footer className="w-full border-t bg-background">
      <div className="container py-10 md:py-16">
        <div className="grid grid-cols-1 gap-8 md:grid-cols-4">
          <div className="flex flex-col gap-2">
            <div className="flex items-center gap-2">
              <span className="text-2xl font-bold text-primary">🐝</span>
              <span className="text-xl font-semibold">Beesides</span>
            </div>
            <p className="text-sm text-muted-foreground">
              A next-generation music rating & discovery platform.
            </p>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Platform</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/discover" className="hover:text-primary">
                  Discover
                </Link>
              </li>
              <li>
                <Link href="/releases" className="hover:text-primary">
                  Releases
                </Link>
              </li>
              <li>
                <Link href="/artists" className="hover:text-primary">
                  Artists
                </Link>
              </li>
              <li>
                <Link href="/charts" className="hover:text-primary">
                  Charts
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Community</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/reviews" className="hover:text-primary">
                  Reviews
                </Link>
              </li>
              <li>
                <Link href="/lists" className="hover:text-primary">
                  Lists
                </Link>
              </li>
              <li>
                <Link href="/forums" className="hover:text-primary">
                  Forums
                </Link>
              </li>
              <li>
                <Link href="/discord" className="hover:text-primary">
                  Discord
                </Link>
              </li>
            </ul>
          </div>

          <div className="flex flex-col gap-2">
            <h4 className="text-sm font-medium">Company</h4>
            <ul className="flex flex-col gap-2 text-sm text-muted-foreground">
              <li>
                <Link href="/about" className="hover:text-primary">
                  About
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-primary">
                  Blog
                </Link>
              </li>
              <li>
                <Link href="/careers" className="hover:text-primary">
                  Careers
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-primary">
                  Contact
                </Link>
              </li>
            </ul>
          </div>
        </div>

        <div className="mt-10 flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <p className="text-xs text-muted-foreground">
            &copy; {new Date().getFullYear()} Beesides. All rights reserved.
          </p>
          <div className="flex gap-4">
            <Link
              href="/terms"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Terms of Service
            </Link>
            <Link
              href="/privacy"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Privacy Policy
            </Link>
            <Link
              href="/cookies"
              className="text-xs text-muted-foreground hover:text-primary"
            >
              Cookie Policy
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}

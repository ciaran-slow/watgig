import { useAuth0, withAuthenticationRequired } from "@auth0/auth0-react"
import { ReactNode } from "react"

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const Component = withAuthenticationRequired(() => <>{children}</>, {
    onRedirecting: () => <div className="p-12 text-white font-black uppercase tracking-widest text-center">Redirecting you to login...</div>,
  })

  return <Component />
}

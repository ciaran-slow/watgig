import { useAuth0 } from '@auth0/auth0-react'
import { ReactNode, useEffect } from 'react'
import { useLocation } from 'react-router'

interface Props {
  children: ReactNode
}

export function ProtectedRoute({ children }: Props) {
  const { isAuthenticated, isLoading, loginWithRedirect } = useAuth0()
  const location = useLocation()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      void loginWithRedirect({
        appState: { returnTo: `${location.pathname}${location.search}` },
      })
    }
  }, [isAuthenticated, isLoading, location.pathname, location.search, loginWithRedirect])

  if (isLoading || !isAuthenticated) {
    return (
      <div className="p-12 text-white font-black uppercase tracking-widest text-center">
        Redirecting you to login...
      </div>
    )
  }

  return <>{children}</>
}

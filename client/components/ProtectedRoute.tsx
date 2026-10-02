import { FormSkeleton } from './Skeleton'
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
      <FormSkeleton label="Redirecting you to login" />
    )
  }

  return <>{children}</>
}

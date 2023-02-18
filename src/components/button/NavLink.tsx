import { Navbar } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useRoute, type LinkProps } from 'wouter'

export type TNavLinkProps = { matcher?: string } & LinkProps

function NavLink(props: TNavLinkProps) {
  const [location] = useLocation()
  const [isActive] = useRoute(props.matcher ?? props.href!)
  const [forceActive, setForceActive] = useState<boolean>(isActive)

  useEffect(() => {
    if (props.matcher === '/dataset/:datasetId*' && location === '/') {
      setForceActive(true)
    } else if (
      props.matcher === '/calculator' &&
      location.startsWith('/token/')
    ) {
      setForceActive(true)
    } else {
      setForceActive(isActive)
    }
  }, [props.matcher, location])

  return (
    <Link {...props}>
      <Navbar.Link isActive={forceActive}>{props.children}</Navbar.Link>
    </Link>
  )
}

export default NavLink

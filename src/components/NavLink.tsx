import { Link, useRoute, type LinkProps } from 'wouter'
import { Navbar } from '@nextui-org/react'

function NavLink(props: LinkProps) {
  const [isActive] = useRoute(props.href!)

  return (
    <Link {...props}>
      <Navbar.Link isActive={isActive}>{props.children}</Navbar.Link>
    </Link>
  )
}

export default NavLink

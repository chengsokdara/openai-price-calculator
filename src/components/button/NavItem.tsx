import { Button, Navbar, type PressEvent } from '@nextui-org/react'
import { useEffect, useState } from 'react'
import { Link, useLocation, useRoute, type LinkProps } from 'wouter'

export type TNavItemProps = {
  matcher?: string
  onPress?: (event: PressEvent) => void
} & LinkProps

function NavItem(props: TNavItemProps) {
  const [location, navigate] = useLocation()
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
    <Navbar.CollapseItem>
      <Link {...props}>
        <Button
          css={{ w: 'stretch' }}
          bordered={!forceActive}
          borderWeight="light"
          color="gradient"
          rounded
          shadow
          size="lg"
          onPress={(e) => {
            props.onPress?.(e)
            navigate(props.href!)
          }}
        >
          {props.children}
        </Button>
      </Link>
    </Navbar.CollapseItem>
  )
}

export default NavItem

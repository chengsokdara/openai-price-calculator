import { Button, type ButtonProps } from '@nextui-org/react'
import { Link, useLocation } from 'wouter'

export type TButtonLinkProps = {
  href: string
} & ButtonProps

function ButtonLink({ href, ...props }: TButtonLinkProps) {
  const [_, navigate] = useLocation()
  return (
    <Link href={href}>
      <Button {...props} onPress={() => navigate(href)} />
    </Link>
  )
}

export default ButtonLink

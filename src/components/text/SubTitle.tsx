import { Text, type TextProps } from '@nextui-org/react'

function SubTitle({ css, children, ...props }: TextProps) {
  return (
    <Text
      css={{
        my: '$0',
        textGradient: '45deg, $pink600 20%, $blue600 80%',
        ...css,
      }}
      h2
      size="$4xl"
      {...props}
    >
      {children}
    </Text>
  )
}

export default SubTitle

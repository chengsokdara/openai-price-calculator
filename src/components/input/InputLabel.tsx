import { Text, type TextProps } from '@nextui-org/react'

function InputLabel({ children, css, ...props }: TextProps) {
  return (
    <Text
      css={{
        my: '$sm',
        textGradient: '45deg, $blue600 -20%, $pink600 50%',
        ...css,
      }}
      h5
      {...props}
    >
      {children}
    </Text>
  )
}

export default InputLabel

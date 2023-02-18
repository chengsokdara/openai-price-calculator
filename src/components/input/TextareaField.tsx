import { Spacer, Textarea } from '@nextui-org/react'
import type { TextareaProps } from '@nextui-org/react/types/textarea'
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
} from 'react-hook-form'

export type TTextareaFieldProps<T extends FieldValues> = {
  control: ControllerProps<T>['control']
  name: keyof T
  rules?: ControllerProps<T>['rules']
} & Partial<TextareaProps>

function TextareaField<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: TTextareaFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      rules={rules}
      render={({ field }) => (
        <>
          <Textarea {...field} {...props} />
          {props.status === 'error' ? <Spacer y={0.5} /> : null}
        </>
      )}
    />
  )
}

export default TextareaField

import { Input, Spacer, type InputProps } from '@nextui-org/react'
import {
  Controller,
  type ControllerProps,
  type FieldValues,
  type Path,
} from 'react-hook-form'

export type TInputFieldProps<T extends FieldValues> = {
  control: ControllerProps<T>['control']
  name: keyof T
  rules?: ControllerProps<T>['rules']
} & Partial<InputProps>

function InputField<T extends FieldValues>({
  control,
  name,
  rules,
  ...props
}: TInputFieldProps<T>) {
  return (
    <Controller
      control={control}
      name={name as Path<T>}
      rules={rules}
      render={({ field }) => (
        <>
          <Input {...field} {...props} />
          {props.status === 'error' ? <Spacer y={0.5} /> : null}
        </>
      )}
    />
  )
}

export default InputField

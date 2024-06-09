import { cn } from '@/lib/utils'
import { Label } from '../ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '../ui/select'

type SelectGeneral = {
  items: Array<{ value: string; label: string } | string>
  placeholder?: string
  value: string
  onChange: (value: string) => void
  label?: string
  required?: boolean
  containerClassName?: string
  triggerClassName?: string
}

function SelectGeneral(props: SelectGeneral) {
  const renderItems = () => {
    const items = props.items.map((item) => {
      if (typeof item === 'string') {
        return { value: item, label: item }
      }

      return item
    })

    return items.map((item) => {
      return (
        <SelectItem key={item.value} value={item.value} className='font-sans'>
          {item.label}
        </SelectItem>
      )
    })
  }

  return (
    <Select
      value={props.value}
      onValueChange={props.onChange}
      required={props.required}
    >
      <div className={cn('flex flex-col gap-1', props.containerClassName)}>
        {props.label ? (
          <div className="flex gap-1">
            <Label className="font-bold font-sans text-dark-blue">
              {props.label}
            </Label>
            {props.required ? <span className="text-red-700">*</span> : null}
          </div>
        ) : null}
        <SelectTrigger className={cn('w-[180px] font-sans', props.triggerClassName)}>
          <SelectValue placeholder={props.placeholder} />
        </SelectTrigger>
      </div>
      <SelectContent>{renderItems()}</SelectContent>
    </Select>
  )
}

export default SelectGeneral

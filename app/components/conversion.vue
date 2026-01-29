<script lang="ts" setup>
import {
  Item,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Button } from './ui/button'
import { ArrowRightLeft, CheckIcon, ChevronsUpDownIcon } from 'lucide-vue-next'

import { ScrollArea } from '@/components/ui/scroll-area'
import { cn } from '@/lib/utils'
import {
  Command,
  CommandEmpty,
  CommandGroup,
  CommandInput,
  CommandItem,
  CommandList,
} from '@/components/ui/command'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'

const props = defineProps<{
  countryFromImg: string
  countryToImg: string
  countryFromStr: string
  countryToStr: string
  countryFromFallback: string
  countryToFallback: string
}>()

const { data: frameworks } = await useFetch('/api/currency-list')
const openFrom = ref(false)
const openTo = ref(false)
const valueFrom = useState('convert-from')
const valueTo = useState('convert-to')
function selectFramework(selectedValue: string, bool: boolean) {
  if (bool == true) {
    valueFrom.value = selectedValue === valueFrom.value ? '' : selectedValue
    openFrom.value = false
  }
  else {
    valueTo.value = selectedValue === valueTo.value ? '' : selectedValue
    openTo.value = false
  }
}
function reverse() {
  const tempArray = [valueFrom.value, valueTo.value]
  valueFrom.value = tempArray[1]
  valueTo.value = tempArray[0]
}
</script>

<template>
  <div class="flex flex-row gap-3 justify-center items-center">
    <div class="flex w-full max-w-lg flex-col gap-3">
      <Popover v-model:open="openFrom">
        <PopoverTrigger
          as-child
          class="hover:bg-secondary cursor-pointer"
        >
          <Item variant="outline">
            <ItemMedia>
              <Avatar class="size-10">
                <AvatarImage :src="countryFromImg" />
                <AvatarFallback>{{ countryFromFallback }}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemDescription
                v-if="countryFromStr !== ''"
                class="text-xs text-primary font-medium"
              >
                Convert from...
              </ItemDescription>
              <ItemTitle v-if="countryFromStr === ''">
                Convert from...
              </ItemTitle>
              <ItemTitle v-else>
                {{ countryFromStr }}
              </ItemTitle>
            </ItemContent>
          </Item>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0">
          <Command>
            <CommandInput
              class="h-9"
              placeholder="Search currency..."
            />
            <ScrollArea>
              <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="(framework_value, framework_key) in frameworks"
                    :key="framework_value"
                    :value="framework_key"
                    @select="(ev) => {
                      selectFramework(ev.detail.value as string, true)
                    }"
                  >
                    {{ framework_value }}
                    <CheckIcon
                      :class="cn(
                        'ml-auto',
                        valueFrom === framework_key ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
      <Popover v-model:open="openTo">
        <PopoverTrigger
          as-child
          class="hover:bg-secondary cursor-pointer"
        >
          <Item variant="outline">
            <ItemMedia>
              <Avatar class="size-10">
                <AvatarImage :src="countryToImg" />
                <AvatarFallback>{{ countryToFallback }}</AvatarFallback>
              </Avatar>
            </ItemMedia>
            <ItemContent>
              <ItemDescription
                v-if="countryToStr !== ''"
                class="text-xs text-primary font-medium"
              >
                Convert to...
              </ItemDescription>
              <ItemTitle v-if="countryToStr === ''">
                Convert to...
              </ItemTitle>
              <ItemTitle v-else>
                {{ countryToStr }}
              </ItemTitle>
            </ItemContent>
          </Item>
        </PopoverTrigger>
        <PopoverContent class="w-[200px] p-0">
          <Command>
            <CommandInput
              class="h-9"
              placeholder="Search currency..."
            />
            <ScrollArea>
              <CommandList>
                <CommandEmpty>No currency found.</CommandEmpty>
                <CommandGroup>
                  <CommandItem
                    v-for="(framework_value, framework_key) in frameworks"
                    :key="framework_value"
                    :value="framework_key"
                    @select="(ev) => {
                      selectFramework(ev.detail.value as string, false)
                    }"
                  >
                    {{ framework_value }}
                    <CheckIcon
                      :class="cn(
                        'ml-auto',
                        valueTo === framework_key ? 'opacity-100' : 'opacity-0',
                      )"
                    />
                  </CommandItem>
                </CommandGroup>
              </CommandList>
            </ScrollArea>
          </Command>
        </PopoverContent>
      </Popover>
    </div>
    <Button
      variant="outline"
      size="icon"
      class="cursor-pointer"
      @click="reverse()"
    >
      <ArrowRightLeft />
    </Button>
  </div>
</template>

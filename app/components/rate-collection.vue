<script setup lang="ts">
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import { Badge } from '@/components/ui/badge'
import { BadgeAlert } from 'lucide-vue-next'
import {
  Item,
  ItemActions,
  ItemContent,
  ItemDescription,
  ItemMedia,
  ItemTitle,
} from '@/components/ui/item'
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyMedia,
  EmptyTitle,
} from '@/components/ui/empty'
const props = defineProps<{
  finalArray: [number, string, string, string][]
  convertFrom: string,
  convertTo: string
}>()
const page = ref(1)
const itemsPerPage = ref(4);
const total = ref(8)
const dataPlaceholder = computed<number[]>(() => {
  const finalArray: number[] = []
  for (let i = 0; i < itemsPerPage.value; i++ ) {
    finalArray.push(((page.value-1)*itemsPerPage.value+i))
  }
  return finalArray
})
const visibleArray = computed(() => {
  return props.finalArray.filter((item) => {
    if (dataPlaceholder.value.includes(item[0]) && (props.convertFrom == item[1] || props.convertFrom == "") && (props.convertTo == item[2] || props.convertTo == "")) {
      return item
    }
  })
})
function updateCurrency(convertFrom: string, convertTo: string) {
  stateConvertFrom.value = convertFrom
  stateConvertTo.value = convertTo
}
type imgJson = Record<string, string>
const imgList = await $fetch<imgJson>("/api/currency-image")
const date = useState<string[]>("dates") ?? ref([""])
const stateConvertFrom = useState("convert-from")
const stateConvertTo = useState("convert-to")
</script>
<template>
  <div class="flex flex-col flex-1 justify-between">
    <div class="flex flex-col gap-3">
      <Badge variant="outline">StarNote's Recommendation</Badge>
      <div v-for="data of visibleArray" :key="data[0]" v-if="visibleArray.length != 0">
        <Item variant="outline" v-on:click="updateCurrency(data[1], data[2])" class="cursor-pointer">
          <ItemMedia>
            <div class="*:data-[slot=avatar]:ring-background flex -space-x-2 *:data-[slot=avatar]:ring-2">
              <Avatar>
                <AvatarImage :src="`https://flagcdn.com/w320/${imgList[data[1]]?.toLowerCase()}.webp`"/>
                <AvatarFallback>{{ data[1] }}</AvatarFallback>
              </Avatar>
              <Avatar>
                <AvatarImage
                  :src="`https://flagcdn.com/w320/${imgList[data[2]]?.toLowerCase()}.png`"
                />
                <AvatarFallback>{{ data[2] }}</AvatarFallback>
              </Avatar>
            </div>
          </ItemMedia>
          <ItemContent>
            <ItemTitle>{{ data[3] }}</ItemTitle>
            <ItemDescription>{{ `Rate retrieved on ${date[0]}` }}</ItemDescription>
          </ItemContent>
        </Item>
      </div>
      <div v-else>
          <Empty>
            <EmptyHeader>
              <EmptyMedia variant="icon">
                <BadgeAlert />
              </EmptyMedia>
              <EmptyTitle>No currencies in StarNote’s Recommendation</EmptyTitle>
              <EmptyDescription>
                Currencies recommended by StarNote will appear here.
              </EmptyDescription>
            </EmptyHeader>
          </Empty>
      </div>
    </div>
    <Pagination v-slot="{ page }" v-model:items-per-page="itemsPerPage" v-model:total="total" v-model:page="page">
      <PaginationContent v-slot="{ items }">
        <PaginationPrevious />
        <template v-for="(item, index) in items" :key="index">
          <PaginationItem
            v-if="item.type === 'page'"
            :value="item.value"
            :is-active="item.value === page"
          >
            {{ item.value }}
          </PaginationItem>
        </template>
        <PaginationNext />
      </PaginationContent>
    </Pagination>
  </div>
</template>
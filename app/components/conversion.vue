<script lang="ts" setup>
    const props = defineProps<{
        countryFromImg: string,
        countryToImg: string,
        countryFromStr: string,
        countryToStr: string,
        countryFromFallback: string,
        countryToFallback: string
    }>()
    import {
        Item,
        ItemContent,
        ItemDescription,
        ItemMedia,
        ItemTitle,
    } from '@/components/ui/item'
    import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
    import { Button } from './ui/button'
    import { ArrowRightLeft } from 'lucide-vue-next'
</script>
<template>
    <div class="flex flex-row gap-3 justify-center items-center">
        <div class="flex w-full max-w-lg flex-col gap-3">
            <Item variant="outline">
            <ItemMedia>
                <Avatar class="size-10">
                <AvatarImage v-if="countryFromStr !== ''" :src="countryFromImg" />
                <AvatarFallback>{{ countryFromFallback }}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemDescription v-if="countryFromStr !== ''" class="text-xs text-primary font-medium">Convert from...</ItemDescription>
                <ItemTitle v-if="countryFromStr === ''">Convert from...</ItemTitle>
                <ItemTitle v-else>{{ countryFromStr }}</ItemTitle>
            </ItemContent>
            </Item>
            <Item variant="outline">
            <ItemMedia>
                <Avatar class="size-10">
                <AvatarImage v-if="countryToStr !== ''" :src="countryToImg" />
                <AvatarFallback>{{ countryToFallback }}</AvatarFallback>
                </Avatar>
            </ItemMedia>
            <ItemContent>
                <ItemDescription v-if="countryToStr !== ''" class="text-xs text-primary font-medium">Convert to...</ItemDescription>
                <ItemTitle v-if="countryToStr === ''">Convert to...</ItemTitle>
                <ItemTitle v-else>{{ countryToStr }}</ItemTitle>
            </ItemContent>
            </Item>
        </div>
        <Button variant="outline" size="icon">
            <ArrowRightLeft />
        </Button>
    </div>
</template>
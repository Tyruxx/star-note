<script>
definePageMeta({
  middleware: ['auth'],
})
</script>

<template>
  <div class="mx-auto px-8 py-8 flex flex-col h-screen justify-between max-w-lg">
    <div class="flex flex-col gap-4">
      <div>
        <Button variant="secondary">
          Demo
        </Button>
      </div>
      <div class="w-fit text-5xl font-semibold">
        Learn more about the additional fees
      </div>
      <div class="text-base">
        StarNote displays a single final exchange rate that already includes all applicable costs. This covers potential charges such as platform fees, service fees, and exchange markups, all of which would normally be factored directly into the rate rather than added separately.<br><br>At the moment, all such costs are set to zero. This means there are no platform fees, no service charges, and no exchange markups applied, so the displayed rate reflects the pure exchange rate with no additional charges incurred.<br><br><span class="font-semibold">Conversion rate is provided by jsdelivr CDN</span>
      </div>
    </div>
    <div class="">
      <NuxtLink to="/"><Button class="w-full cursor-pointer">Back</Button></NuxtLink>
    </div>
  </div>
</template>

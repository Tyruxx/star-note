<script lang="ts">
export const description = "A login page with a muted background color."
</script>

<script setup lang="ts">
import { Asterisk } from "lucide-vue-next"
import LoginForm from "@/components/login-form.vue"
// try {
//   const { account } = useAppwrite()
//   const session = await account.get()
//   console.log(session)
//   navigateTo('/')
//     }
// catch (error) {
//   console.log(error)
// }
</script>

<template>
  <div class="bg-muted flex min-h-svh flex-col min-h-screen items-center justify-center gap-6 p-6 md:p-10">
    <div class="flex w-full max-w-sm flex-col gap-6">
        <div class="flex items-center gap-2 self-center font-medium">
            <div class="bg-primary text-primary-foreground flex size-6 items-center justify-center rounded-md">
            <Asterisk />
            </div>
            StarNote
        </div>
      <LoginForm />
    </div>
  </div>
</template>

<script setup lang="ts">
import { Asterisk } from "lucide-vue-next"
import LoginForm from "@/components/login-form.vue"
const loading = useState("loading-login", () => false)
import PixelSnow from '@/components/PixelSnow/PixelSnow.vue'
</script>

<template>
  <div class="bg-muted flex min-h-svh flex-col min-h-screen items-center justify-center gap-6 p-6 md:p-10">
    <div style="width: 100%; height: 100%; position: absolute; top: 0; left: 0; z-index: 0">
      <PixelSnow
        color="#ffffff"
        :flakeSize="0.01"
        :minFlakeSize="1.25"
        :pixelResolution="200"
        :speed="1.25"
        :density="0.2"
        :direction="125"
        :brightness="1"
      />
    </div>
    <div class="flex w-full max-w-sm flex-col gap-6" style="position: relative; z-index: 1">
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

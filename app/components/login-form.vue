<script setup lang="ts">
const { account } = useAppwrite()
import { useAppwrite } from "~/composables/useAppwrite"
import type { HTMLAttributes } from "vue"
import { Check } from "lucide-vue-next"
import { cn } from "@/lib/utils"
import { Button } from '@/components/ui/button'
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from '@/components/ui/card'
import {
  Field,
  FieldDescription,
  FieldGroup,
  FieldLabel,
  FieldSeparator,
} from '@/components/ui/field'
import { Input } from '@/components/ui/input'
import { OAuthProvider } from "appwrite"

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()

function createOAuth() {
  account.createOAuth2Session({
      provider: OAuthProvider.Google,
      success: 'https://star-note-ten.vercel.app/',
      failure: 'https://star-note-ten.vercel.app/error',
      scopes: ['account']
    }
  )
}

</script>

<template>
  <div :class="cn('flex flex-col gap-6', props.class)">
    <Card class="py-8">
      <CardHeader class="text-center">
        <CardTitle class="text-xl">
          Welcome to StarNote Converter
        </CardTitle>
        <CardDescription class="flex flex-col items-start text-base text-primary">
          <div class="flex flex-row gap-2"><Check />Track currencies in real time</div>
          <div class="flex flex-row gap-2"><Check />Predict rates with AI</div>
        </CardDescription>
      </CardHeader>
      <CardContent>
        <form>
          <FieldGroup>
            <Field>
              <Button type="button" @click="createOAuth()">
                <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                  <path
                    d="M12.48 10.92v3.28h7.84c-.24 1.84-.853 3.187-1.787 4.133-1.147 1.147-2.933 2.4-6.053 2.4-4.827 0-8.6-3.893-8.6-8.72s3.773-8.72 8.6-8.72c2.6 0 4.507 1.027 5.907 2.347l2.307-2.307C18.747 1.44 16.133 0 12.48 0 5.867 0 .307 5.387.307 12s5.56 12 12.173 12c3.573 0 6.267-1.173 8.373-3.36 2.16-2.16 2.84-5.213 2.84-7.667 0-.76-.053-1.467-.173-2.053H12.48z"
                    fill="currentColor"
                  />
                </svg>
                Login with Google
              </Button>
            </Field>
          </FieldGroup>
        </form>
      </CardContent>
    </Card>
    <FieldDescription class="px-6 text-center">
      By clicking continue, you agree to our Terms of Service
      and Privacy Policy.
    </FieldDescription>
  </div>
</template>

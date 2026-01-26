<script setup lang="ts">
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
import {
  GoogleSignInButton,
  type CredentialResponse,
} from "vue3-google-signin";
const { loggedIn, session, user: userSession, clear, fetch: refreshSession } = useUserSession()

// handle success event
type GoogleProfileInfo = {}
const user = useState<GoogleProfileInfo | null | undefined>("user", () => null)
const handleLoginSuccess = async (response: CredentialResponse) => {
  const { credential } = response;

  if (credential) {
    const { data, error } = await useFetch<GoogleProfileInfo>("/api/google-login", {
      method: "POST",
      body: {
        token: credential
      }
    })
    if (error.value != undefined) {
      throw createError({
        statusCode: error.value.statusCode,
        statusMessage: error.value.statusMessage,
        fatal: true
      })
    } else {
      user.value = data.value
      await refreshSession()
      await navigateTo('/')
    }
  }
};

// handle an error event
const handleLoginError = () => {
  console.error("Login failed");
};

const props = defineProps<{
  class?: HTMLAttributes["class"]
}>()
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
              <div class="flex justify-center">
                <GoogleSignInButton
                  @success="handleLoginSuccess"
                  @error="handleLoginError">
                </GoogleSignInButton>
              </div>
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

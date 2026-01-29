import { createClient } from '@supabase/supabase-js'
import type { Database } from './../types/database.types'

const config = useRuntimeConfig()
const supabaseUrl = config.public.supabaseUrl
const supabaseKey = config.public.supabaseKey

export const supabase = createClient<Database>(supabaseUrl, supabaseKey)

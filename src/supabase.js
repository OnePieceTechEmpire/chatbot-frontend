import { createClient } from '@supabase/supabase-js'

const supabaseUrl = 'https://slvlrqstmjxaijrijchx.supabase.co'
const supabaseKey = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InNsdmxycXN0bWp4YWlqcmlqY2h4Iiwicm9sZSI6InNlcnZpY2Vfcm9sZSIsImlhdCI6MTc0NTgzNTE0NCwiZXhwIjoyMDYxNDExMTQ0fQ.gjtU52gYX82f23kxQaYqUUYBIvRp8AxkzNfbAXP_OkE'

export const supabase = createClient(supabaseUrl, supabaseKey)
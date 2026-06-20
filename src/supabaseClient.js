import { createClient } from '@supabase/supabase-js';

// 여기에 아까 찾은 주소와 키를 넣으세요!
const supabaseUrl = 'https://mtiodywxazvotktmzbew.supabase.co';
const supabaseKey = 'sb_publishable_xeZ_4vN6XYNZNncAjJlbSw__z6N-Tmo';

export const supabase = createClient(supabaseUrl, supabaseKey);
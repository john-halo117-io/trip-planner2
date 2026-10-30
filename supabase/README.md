# Setting up encrypted sync (one time, ~5 minutes)

Your trip is encrypted on your phone (AES-256-GCM) before it's uploaded. Supabase only stores
scrambled data plus a hash of the write key, so it can't read your trip, and neither can anyone
who gets into the database.

1. Go to **supabase.com** and sign up (free). Turn on 2FA in your Supabase account settings.
2. **New project.** Name it `trip-planner`, set a strong database password (save it in your password
   manager; the app never needs it), and pick the region **Europe West (London)** or **US East**.
3. Open **SQL Editor → New query**, paste everything in [`setup.sql`](setup.sql), and tap **Run**.
   It should say "Success. No rows returned."
4. Go to **Project Settings → API Keys** and copy:
   - the **Project URL** (`https://xxxxxxxx.supabase.co`, also under Settings → Data API)
   - the **Publishable key** (`sb_publishable_…`). This one is meant to be public.
   - **Never** copy the *secret* / `service_role` key. The app refuses it if you try.
5. In the app: **Trip → Sync & travel partner**, paste both, tap **Start syncing this trip**.
6. Tap **Share sync code** and send it to your partner **in iMessage or Signal only**. They open the
   app, go to Trip → paste it under "join with a sync code" → **Join trip**. Same for your computer.

## Good to know
- **The sync code is the key.** Anyone with it can read and edit the trip. If it leaks: Trip →
  *Delete trip from server*, then *Start syncing* again to get a fresh code.
- Free Supabase projects pause after about a week with no use. If sync says it can't reach the
  server, open supabase.com and tap **Restore project**.
- Edits merge item by item, so you and your partner can both edit offline. If you both change the
  *same* pin, the most recent edit wins.
- Weather, exchange-rate and map caches stay on each phone and aren't synced.

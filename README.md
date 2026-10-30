# Trip Planner

A phone-first trip planning web app: pin map with real street-level maps, queue → day plans with daylight budgets, live weather that sets each day's outfit, packing list, spending tracker, and offline maps. Installs to the iPhone home screen from Safari (Share → Add to Home Screen).

- Maps: MapLibre GL + OpenFreeMap (OpenStreetMap data)
- Place search: Photon (komoot, OpenStreetMap)
- Photos & info: Wikimedia Commons + Wikipedia (credits shown on each photo)
- Opening hours: OpenStreetMap via Overpass (only when you tap “Look up”)
- Weather: Open-Meteo · Exchange rates: Frankfurter (ECB)
- Data lives on the device. Optional **end-to-end encrypted sync** between your devices and a travel partner via your own free Supabase project. See [supabase/README.md](supabase/README.md).

No build step: plain HTML/CSS/JS. Host as static files (GitHub Pages).

## Security & privacy
- No API keys or secrets anywhere: every service used is free and keyless.
- Your trip data stays on your phone. If you turn on sync, it's encrypted on the phone first (AES-256-GCM, keys derived with HKDF from a 256-bit random sync code). The server stores only ciphertext and a SHA-256 of the write key, the table is locked behind row-level security, and the app can only call three narrow functions.
- The site sets a strict Content-Security-Policy: scripts only from this site; network calls only to the map, weather, exchange-rate and place-search services listed above.
- MapLibre and the fonts are self-hosted at pinned versions during deploy (MapLibre checksum-verified), so no third-party scripts or fonts load.
- GitHub Actions are pinned to exact commits; Dependabot watches them for updates.
- The app refuses to run inside another site's frame, and place searches are never cached on the device.
- Deploys run through GitHub Actions with least-privilege permissions; GitHub Pages serves it over HTTPS only.
- What third parties see: the map server sees which map areas you view; Open-Meteo sees the coordinates of your day bases; Photon sees what you search for; Wikipedia/Commons see which places you open photos for; Overpass sees a pin's location when you look up its hours. The Safety card's GPS location and the Calendar file are made on the phone and never sent anywhere. None of them get your name or your account.

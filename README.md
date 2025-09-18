# Minecraft Entity Stats Detection HUD Addon

Addon scripting untuk Minecraft Bedrock Edition menggunakan **TypeScript**.  
Fitur utama:
- HUD mini untuk mendeteksi **Health, Armor, Total Dmg, Active Effects** entity.
- Damage counter (total damage yang diterima entity).
- Sistem **View-Lock** (sneak + klik untuk kunci target).
- Nama entity otomatis dengan label `(LOCK)` bila terkunci.
- Cooldown overlay (seperti mekanisme shield) untuk mencegah spam.
- Ditulis dalam **TypeScript**, compile ke **JavaScript** untuk dijalankan di Minecraft.

## Struktur
- **BP/** → Behavior Pack (script dan logic addon)
- **RP/** → Resource Pack (ikon, tampilan visual, resource tambahan)
- **scripts/** → Source TypeScript (`main.ts`) + hasil compile (`main.js`)

## Cara Install
1. Compile script TypeScript (`tsc`) → hasil ke folder `BP/scripts/`. (atau jika tidak ingin develop compile bisa langsung ke step 2)
2. Compress `BP` dan `RP` menjadi ZIP → rename format `.zip` ke `.mcaddon`.
3. Klik file `.mcaddon` → buka dengan Minecraft Bedrock.
4. Aktifkan di dunia Minecraft (pastikan *Enable Beta APIs* aktif).
5. Nikmati fitur **Entity Stats Detection HUD**.

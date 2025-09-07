# ⚙️ Scripts (TypeScript → JavaScript)
## For Development

Berisi source code **TypeScript** untuk addon Entity Stats Detection HUD.

## 📂 Struktur
- `kode utama` (`main.ts`).
- `BP/scripts/` → hasil compile (`main.js`).

## 🔄 Proses Compile
1. Pastikan dependency sudah ter-install:
   ```node
   npm i @minecraft/server@1.13.0

2. Compile sekali:
   ```node   
   npx tsc

3. Jalankan mode watch (auto compile saat save):
   ```node
   npx tsc --watch

4. Hasil compile otomatis tersimpan di:
   ```node
   BP/scripts/main.js

# Behavior Pack (BP)

## Isi
- `manifest.json` → metadata addon (UUID, version, dependencies).
- `scripts/` → hasil compile TypeScript (`main.js`) yang dijalankan Minecraft.
- `items/` → custom item (`scanner` dengan custom_components).

## Fitur
- Custom item (`scanner`) dengan komponen:
  - `skill:health_hud` → trigger HUD toggle/lock.
  - `minecraft:cooldown` → overlay cooldown di hotbar.
- Integration dengan `@minecraft/server` API.
- Semua logic addon berjalan di **Behavior Pack** ini.

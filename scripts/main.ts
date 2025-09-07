import { world, system, EntityHealthComponent, EntityEquippableComponent, EquipmentSlot, Player, Entity } from "@minecraft/server"; // modul server

// status HUD per player
let hudEnabled: Record<string, boolean> = {}; 
let damageDealt: Map<string, number> = new Map(); // menyimpan total damage yang diterima oleh setiap entity
let lockedEntities: Map<string, string> = new Map(); // menyimpan entity yang di-lock 

// Format Entity
function formatEntityName(inputString: string): string {
  const withoutUnderscore = inputString.replace(/_/g, " ");
  const words = withoutUnderscore.split(" ");
  const capitalizedWords = words.map(word => {
    if (word.length === 0) {
      return "";
    }
    return word.charAt(0).toUpperCase() + word.slice(1).toLowerCase();
  });
  return capitalizedWords.join(" ");
}

// Format Health
function formatHealth(entity: Entity): string {
  const comp = entity.getComponent("minecraft:health") as EntityHealthComponent;
  if (!comp) return "§7:heart: No Health";
  return `§c:heart: ${Math.floor(comp.currentValue)}/${Math.floor(comp.effectiveMax)} HP`;
}

// Format Amor (karena keterbatasan API tidak lagi Work)
function formatArmor(entity: Entity): string {
  const equip = entity.getComponent("minecraft:equippable") as EntityEquippableComponent;
  if (!equip) return "§7:armor: No Armor";

  const slots: EquipmentSlot[] = [
    EquipmentSlot.Head,
    EquipmentSlot.Chest,
    EquipmentSlot.Legs,
    EquipmentSlot.Feet,
  ];

  const items = slots
    .map(slot => equip.getEquipment(slot))
    .filter(item => item !== undefined);

  return items.length === 0
    ? "§7:armor: No Armor"
    : "§b:armor: Armor:\n" + items.map(it => `- ${it.typeId.replace("minecraft:", "")}`).join("\n");
}

// Format Effects
function formatEffects(entity: Entity): string {
  const effects = entity.getEffects();
  if (!effects || effects.length === 0) return "§7:solid_star: No Effects";

  const effectsList = effects.map((e) =>
    `${e.typeId.replace("minecraft:", "").replace(/_/g, " ")} ${e.amplifier + 1}[${Math.floor(e.duration / 20)}s]`
  );
  
  // Maks Char
  const maxLineLength = 60; 
  const lines: string[] = [];
  let currentLine = "§d:solid_star: Effects: ";

  for (const eff of effectsList) {
    const nextLine = `${currentLine}${eff}. `;
    
    if (nextLine.length > maxLineLength && currentLine !== "§d:solid_star: Effects: ") {
      lines.push(currentLine.trim());
      currentLine = eff + ". ";
    } else {
      currentLine += eff + ". ";
    }
  }

  if (currentLine.length > 0) lines.push(currentLine.trim());

  return lines.join("\n");
}

// Even Total DMG
world.afterEvents.entityHurt.subscribe(ev => {
  const { hurtEntity, damage } = ev;
  if (hurtEntity instanceof Player) {
    return;
  }
  
  const currentDamage = damageDealt.get(hurtEntity.id) || 0;
  damageDealt.set(hurtEntity.id, currentDamage + damage);
});

// sistem locking (jongkok + klik kanan ke arah mob)
system.runInterval(() => {
  for (const player of world.getPlayers()) {
    if (!hudEnabled[player.id]) continue;

    let targetEntity: Entity | undefined;
    const lockedEntityId = lockedEntities.get(player.id);
    
    if (lockedEntityId) {
      targetEntity = world.getEntity(lockedEntityId);
      if (!targetEntity) {
        lockedEntities.delete(player.id);
        player.onScreenDisplay.setActionBar("§7:camera: Lock has been removed...");
        continue;
      }
    } else {
      const target = player.getEntitiesFromViewDirection({ maxDistance: 8 })[0];
      targetEntity = target?.entity;
    }

    if (!targetEntity) {
      player.onScreenDisplay.setActionBar("§7:camera: No target in sight...");
      continue;
    }

    const formattedName = formatEntityName(targetEntity.typeId.replace("minecraft:", ""));
    const lockIndicator = lockedEntityId ? " §l(Lock)§r" : "";
    
    const totalDamage = damageDealt.get(targetEntity.id) || 0;

    const lines = [
      `:tip_crosshair: §6§l${formattedName}${lockIndicator}§r`,
      formatHealth(targetEntity),
      `§e:shank: ${Math.floor(totalDamage)} Total Dmg`,
      formatArmor(targetEntity),
      formatEffects(targetEntity),
    ];

    player.onScreenDisplay.setActionBar(lines.join("\n"));
  }
}, 5);

// event pandangan
world.beforeEvents.worldInitialize.subscribe(ev => {
  const { itemComponentRegistry } = ev;

  itemComponentRegistry.registerCustomComponent("skill:health_hud", {
    onUse: (data) => {
      const { source } = data;
      const cooldownCategory = "hudscanner";

      const target = source.getEntitiesFromViewDirection({ maxDistance: 8 })[0];

      if (source.isSneaking && target && target.entity) {
          lockedEntities.set(source.id, target.entity.id);
          source.playSound("random.orb", { volume: 1, pitch: 1 });
          source.onScreenDisplay.setActionBar("§a:camera: Entity locked!");
      } else if (source.isSneaking && !target) {
          lockedEntities.delete(source.id);
          source.playSound("random.orb", { volume: 1, pitch: 0.5 });
          source.onScreenDisplay.setActionBar("§a:camera: Lock removed!");
      } else {
          hudEnabled[source.id] = !hudEnabled[source.id];

          if (hudEnabled[source.id]) {
            source.playSound("beacon.activate", { volume: 1, pitch: 1.2 });
          } else {
            source.playSound("beacon.deactivate", { volume: 1, pitch: 1.2 });
          }
      }

      // Cooldown 60 tick = 3 detik
      source.startItemCooldown(cooldownCategory, 60);
    },
  });
});
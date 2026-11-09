# SR24PLUS AUTONOMOUS EXECUTION RULES

## Core Principles

1. **Non-Destructive Integrity**: Never overwrite or delete original installed `SKILL.md` files. All orchestration occurs via this routing architecture.
2. **Evidence-Based Activation**: Never claim a skill was activated without reading its actual `SKILL.md` instructions and applying its rules.
3. **Engine-Aware Selectivity**: When activating `02-GAME-DEVELOPMENT`, inspect project files to detect the engine (Godot vs Unity vs Unreal). Never load Unity packages into an Unreal or Godot project.
4. **Anti-Slop Enforcement**: All UI/UX outputs must pass the Anti-Slop filter (no generic purple gradients, no fake cards, no emoji-heavy headers, no meaningless 3D).
5. **Quality Finish Gates**: Production code must be verified by `08-QUALITY-ENGINEERING` before marking tasks complete.
#!/usr/bin/env -S deno run --allow-env --allow-net

// Default CLI entry runs the text translator
import translateText from "../text/translateText.ts";
("./translateText.ts");
import translateJSON from "../json/translateJSON.ts";
("./translateJSON.ts");

// Export the main translation functions for CLI usage
export { translateText, translateJSON };

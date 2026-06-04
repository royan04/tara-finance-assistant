import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

import { taraAgent } from "./agents/taraAgent";

export const mastra = new Mastra({
  agents: {
    taraAgent,
  },

  logger: new PinoLogger({
    name: "Tara",
    level: "info",
  }),
});
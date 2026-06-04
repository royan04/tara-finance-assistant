import { Mastra } from "@mastra/core/mastra";
import { PinoLogger } from "@mastra/loggers";

export const mastra = new Mastra({
  agents: {},
  logger: new PinoLogger({
    name: "Tara",
    level: "info",
  }),
});
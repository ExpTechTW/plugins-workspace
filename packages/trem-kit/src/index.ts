type Awaitable<T> = T | Promise<T>;

type ConfigValue = string | number | boolean;
type ConfigValues = ConfigValue | ConfigValue[];

interface Config<T extends ConfigValues = ConfigValues> {
  name: string;
  description: string;
  default: T;
  choices?: T extends ConfigValue[] ? T : never;
}

type ConfigDef = Record<string, Config>;

interface AppConfig<T extends ConfigDef> {
  get<K extends keyof T>(key: K):
    (
      T[K]['default'] extends ConfigValue[]
        ? T[K]['choices'] extends ConfigValue[]
          ? T[K]['choices']
          : T[K]['default']
        : T[K]['default']
    )
    | null;
  set<K extends keyof T>(key: K, value: T[K]['default'] | null): void;
}

interface AppLogger {
  info(message: string): void;
  warn(message: string): void;
  error(message: string): void;
  debug(message: string): void;
}

interface Eew {
  /** TODO: type Eew objects */
}

interface Report {
  /** TODO: type Report objects */
}

interface Events {
  load: [];
  eew: [eew: Eew];
  report: [report: Report];
  unload: [];
}

interface App<T extends ConfigDef> {
  config: AppConfig<T>;
  logger: AppLogger;

  on<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void;
  once<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void;
  off(event: keyof Events): void;
}

export interface PluginDef<T extends ConfigDef> {
  name: string;
  description: string;
  version: string;
  dependencies?: string[];
  settings: T;
  setup(app: App<T>): Awaitable<void>;
}

// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function definePlugin<T extends ConfigDef = {}>(plugin: PluginDef<T>) {
  return plugin;
}

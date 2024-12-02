/**
 * Represents a valid configuration value.
 *
 * This can be a primitive value (`string`, `number`, or `boolean`) that is
 * directly assignable to a configuration field.
 */
type ConfigValue = string | number | boolean;

/**
 * Represents valid configuration values, including arrays of primitive values.
 *
 * A configuration field can either hold a single primitive value (`string`,
 * `number`, or `boolean`) or an array of such values.
 */
export type ConfigValues = ConfigValue | ConfigValue[];

/**
 * Interface representing a configuration field.
 *
 * @template T - A generic type extending `ConfigValues` that defines the valid
 * types for the configuration field. Defaults to `ConfigValues`.
 */
export interface Config<T extends ConfigValues = ConfigValues> {
  /**
   * The name of the configuration field.
   *
   * This is a descriptive label for the field, and is not used as the key in
   * the configuration file.
   */
  name: string;

  /**
   * A description of the configuration field.
   *
   * Provides additional context or instructions about the purpose or usage of
   * the field.
   */
  description: string;

  /**
   * The default value for the configuration field.
   *
   * This value serves as the field's initial value when no other value is specified
   * in the configuration file. The type of this value determines the type of the
   * configuration field.
   */
  default: T;

  /**
   * (Optional) A list of valid choices for the configuration field.
   *
   * @example
   * // Example of a field with choices
   * {
   *   name: "Theme Color",
   *   description: "The base color of the application.",
   *   default: "red",
   *   choices: ["red", "blue", "green"]
   * }
   */
  choices?: T extends ConfigValue | ConfigValue[] ? ConfigValue[] : never;
}

/**
 * Defines the structure of a plugin user configuration.
 *
 * Each key represents a unique configuration field, mapped to its corresponding
 * `Config` definition. This allows for type-safe configuration management.
 */
export type ConfigDef = Record<string, Config>;

/**
 * Interface representing the configuration manager for a plugin.
 *
 * This provides methods to get and set configuration fields, as well as to
 * retrieve the path to the configuration directory. The configuration fields
 * are defined by the generic type `T`, which extends `ConfigDef`.
 *
 * @template T - A generic type extending `ConfigDef` that defines the structure
 * of the plugin's configuration.
 */
interface AppConfig<T extends ConfigDef> {

  /**
   * Retrieves the value of a specific configuration field by its key.
   *
   * This method returns the value associated with the provided key. If the field
   * defines a list of choices, the method returns the list of choices instead.
   * If no value is set, it returns the default value or `null` if the key is invalid.
   *
   * @param key - The key of the configuration field to retrieve.
   * @returns The value of the field, the list of valid choices if defined,
   * or `null` if the key is invalid or not set.
   */
  get<K extends keyof T>(key: K):
    (
      T[K]['default'] extends ConfigValue | ConfigValue[]
        ? T[K]['choices'] extends ConfigValue[]
          ? T[K]['choices']
          : T[K]['default']
        : T[K]['default']
    )
    | null;

  /**
   * Updates the value of a specific configuration field.
   *
   * This method sets a new value for the configuration field specified by the
   * key. If the field defines a list of valid choices (`choices`), the value
   * must be one of those choices. Otherwise, the value must match the type
   * defined by the field's `default` value. A `null` value clears the setting,
   * reverting it to the default.
   *
   * @param key - The key of the configuration field to update.
   * @param value - The new value to set for the field. If the field defines
   * `choices`, the value must be one of those choices. Otherwise, it must match
   * the field's `default` type. A `null` value clears the field, restoring the
   * default value.
   */
  set<K extends keyof T>(
    key: K,
    value: T[K]['choices'] extends ConfigValue[]
      ? T[K]['choices']
      : T[K]['default'] | null
  ): void;

  /**
   * Retrieves the path of the configuration directory for this plugin.
   *
   * @returns The absolute path to the plugin's configuration directory.
   */
  getDirectory(): string;
}

/**
 * Interface representing a logger for a plugin-based application.
 *
 * All log messages will be prefixed with the name of the plugin.
 */
interface AppLogger {
  /**
   * Logs a message at the INFO level.
   *
   * @param message - The message to log.
   */
  info(message: string): void;

  /**
   * Logs a message at the WARN level.
   *
   * @param message - The warning message to log.
   */
  warn(message: string): void;

  /**
   * Logs a message at the ERROR level.
   *
   * @param message - The error message to log.
   */
  error(message: string): void;

  /**
   * Logs a message at the DEBUG level.
   *
   * @param message - The debug message to log.
   */
  debug(message: string): void;

  /**
   * Gets the path of the log directory.
   *
   * This method returns the directory where log files are stored. This is useful
   * for accessing the logged data programmatically.
   *
   * @returns The path of the log directory.
   */
  getDirectory(): string;
}

interface Eew {
  /** TODO: type Eew objects */
}

interface Report {
  /** TODO: type Report objects */
}

interface Events {
  /**
   * Emitted when the application is fully loaded and ready.
   *
   * This event signifies that all necessary resources and processes have
   * been initialized and the application is prepared for interaction.
   */
  load: [];

  /**
   * Emitted when an Earthquake Early Warning (EEW) is issued or updated.
   *
   * This event provides real-time updates about an EEW, including details such as
   * magnitude, affected regions, and the likelihood of seismic impact.
   *
   * @typeParam eew - The EEW data associated with the event.
   */
  eew: [eew: Eew];

  /**
   * Emitted when an earthquake report is issued or updated.
   *
   * This event provides comprehensive details about a detected earthquake,
   * including information such as its epicenter, depth, magnitude, and other
   * seismological data.
   *
   * @typeParam report - The earthquake report data associated with the event.
   */
  report: [report: Report];

  /**
   * Emitted just before the application quits.
   *
   * This event allows for cleanup operations or other final tasks before the
   * application shuts down. It is triggered immediately prior to the application's
   * termination.
   */
  unload: [];
}

/**
 * Interface representing a dependency for a plugin.
 *
 * Each dependency specifies the name of the dependent plugin or resource
 * and its loading order relative to the current plugin.
 */
interface PluginDependency {
  /**
   * The name of the dependent plugin or resource.
   */
  name: string;

  /**
   * The position of the dependency relative to the current plugin.
   *
   * Can be one of the following:
   * - `'before'`: The dependency must be loaded before the current plugin.
   * - `'after'`: The dependency must be loaded after the current plugin.
   */
  position: 'before' | 'after';
}
/**
 * Interface representing the main application instance for a plugin.
 *
 * The `App` interface provides access to the plugin's configuration, logging capabilities,
 * and event management. It serves as the primary interface for interacting with the
 * application's lifecycle and utilities.
 *
 * @template T - A generic type extending `ConfigDef` that defines the structure
 * of the plugin's configuration.
 */
interface App<T extends ConfigDef> {

  /**
   * The configuration manager for this plugin.
   *
   * Provides methods to get and set configuration fields, and access the
   * configuration directory.
   */
  config: AppConfig<T>;

  /**
   * The logger for this plugin.
   *
   * Provides methods to log messages at various levels. All messages logged
   * will be prefixed with `[plugin.name]`.
   */
  logger: AppLogger;

  /**
   * Registers a callback for a specified event.
   *
   * The callback will be triggered every time the event occurs.
   *
   * @param event - The name of the event to listen for.
   * @param callback - The function to invoke when the event occurs.
   * @see {@link App.once} for one-time callback.
   */
  on<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void;

  /**
   * Registers a one-time callback for a specified event.
   *
   * The callback will be triggered only the first time the event occurs and
   * will automatically be removed afterward.
   *
   * @param event - The name of the event to listen for.
   * @param callback - The function to invoke when the event occurs.
   * @see {@link App.on}
   */
  once<K extends keyof Events>(event: K, callback: (...args: Events[K]) => void): void;

  /**
   * Removes event listeners for a specific event.
   *
   * If callback is provided, only that callback will be removed for the given event.
   * If no callback is provided, all listeners for the specified event will be removed.
   *
   * @param event - The name of the event for which listeners should be removed.
   * @param callback - (Optional) The specific callback to remove. If omitted, all callbacks
   * for the specified event will be removed.
   */
  off<K extends keyof Events>(event: K, callback?: (...args: Events[K]) => void): void;
}

/**
 * Interface representing the definition of a plugin in the application.
 *
 * This interface defines the structure that all plugins must adhere to,
 * including metadata, dependencies, configuration, and the setup function.
 *
 * @template T - A generic type extending `ConfigDef` that defines the shape of
 * the plugin's settings.
 */
export interface PluginDef<T extends ConfigDef> {
  /**
   * The name of the plugin.
   *
   * This name is used to identify the plugin within the application.
   */
  name: string;

  /**
   * A brief description of the plugin.
   */
  description: string;

  /**
   * The version of the plugin.
   *
   * Version should follows [Semantic Versioning](https://semver.org/)
   * (`major.minor.patch`) to ensure compatibility and ease of updates.
   */
  version: string;

  /**
   * (Optional) A list of dependencies required by the plugin.
   */
  dependencies?: PluginDependency[];

  /**
   * The user configuration settings of the plugin.
   */
  settings: T;

  /**
   * The setup function for initializing the plugin.
   *
   * This method is called during the application's setup phase to perform
   * any initialization tasks for the plugin, such as setting up resources.
   *
   * @param app - The application context to which the plugin is being added.
   * It provides the context and resources needed for the plugin's setup.
   */
  setup(app: App<T>): void;
}

/**
 * A helper function to define a plugin with type safety and proper configuration.
 *
 * This function simplifies the creation of plugins by ensuring that the provided
 * plugin definition adheres to the expected structure and types.
 *
 * @template T - A generic type extending `ConfigDef` that defines the shape of the
 * plugin's configuration. Defaults to an empty object (`{}`) if not specified.
 *
 * @param plugin - The plugin definition object that conforms to the `PluginDef<T>` interface.
 *
 * @returns The provided `plugin` definition, unchanged but typed as `PluginDef<T>`.
 *
 * @example
 * export default definePlugin({
 *   name: 'example-plugin',
 *   description: 'An example plugin',
 *   version: '1.0.0',
 *   settings: { foo: 'bar' },
 *   setup(app) {
 *     // Plugin setup logic
 *   }
 * });
 */
// eslint-disable-next-line @typescript-eslint/no-empty-object-type
export function definePlugin<T extends ConfigDef = {}>(plugin: PluginDef<T>) {
  return plugin;
}

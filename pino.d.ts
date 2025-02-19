// Type definitions for pino 6.3
// Project: https://github.com/pinojs/pino.git, http://getpino.io
// Definitions by: Peter Snider <https://github.com/psnider>
//                 BendingBender <https://github.com/BendingBender>
//                 Christian Rackerseder <https://github.com/screendriver>
//                 GP <https://github.com/paambaati>
//                 Alex Ferrando <https://github.com/alferpal>
//                 Oleksandr Sidko <https://github.com/mortiy>
//                 Harris Lummis <https://github.com/lummish>
//                 Raoul Jaeckel <https://github.com/raoulus>
//                 Cory Donkin <https://github.com/Cooryd>
//                 Adam Vigneaux <https://github.com/AdamVig>
//                 Austin Beer <https://github.com/austin-beer>
//                 Michel Nemnom <https://github.com/Pegase745>
//                 Igor Savin <https://github.com/kibertoad>
// Definitions: https://github.com/DefinitelyTyped/DefinitelyTyped
// TypeScript Version: 3.0

/// <reference types="node"/>

import { EventEmitter } from "events";
import { SonicBoom } from "sonic-boom";
import * as pinoStdSerializers from "pino-std-serializers";
import { WriteStream } from "fs";
import { WorkerOptions } from "worker_threads";

export default P;
export { P as pino }
export type { P }

type LogDescriptor = Record<string, any>;
type MessageFormatFunc = (log: LogDescriptor, messageKey: string, levelLabel: string) => string;

/**
 * @param [optionsOrStream]: an options object or a writable stream where the logs will be written. It can also receive some log-line metadata, if the
 * relative protocol is enabled. Default: process.stdout
 * @returns a new logger instance.
 */
declare function P(optionsOrStream?: P.LoggerOptions | P.DestinationStream): P.Logger;

/**
 * @param [options]: an options object
 * @param [stream]: a writable stream where the logs will be written. It can also receive some log-line metadata, if the
 * relative protocol is enabled. Default: process.stdout
 * @returns a new logger instance.
 */
declare function P(options: P.LoggerOptions, stream: P.DestinationStream): P.Logger;

declare namespace P {
    /**
     * Holds the current log format version (as output in the v property of each log record).
     */
    const levels: LevelMapping;
    const symbols: {
        readonly setLevelSym: unique symbol;
        readonly getLevelSym: unique symbol;
        readonly levelValSym: unique symbol;
        readonly useLevelLabelsSym: unique symbol;
        readonly mixinSym: unique symbol;
        readonly lsCacheSym: unique symbol;
        readonly chindingsSym: unique symbol;
        readonly parsedChindingsSym: unique symbol;
        readonly asJsonSym: unique symbol;
        readonly writeSym: unique symbol;
        readonly serializersSym: unique symbol;
        readonly redactFmtSym: unique symbol;
        readonly timeSym: unique symbol;
        readonly timeSliceIndexSym: unique symbol;
        readonly streamSym: unique symbol;
        readonly stringifySym: unique symbol;
        readonly stringifiersSym: unique symbol;
        readonly endSym: unique symbol;
        readonly formatOptsSym: unique symbol;
        readonly messageKeySym: unique symbol;
        readonly nestedKeySym: unique symbol;
        readonly wildcardFirstSym: unique symbol;
        readonly needsMetadataGsym: unique symbol;
        readonly useOnlyCustomLevelsSym: unique symbol;
        readonly formattersSym: unique symbol;
        readonly hooksSym: unique symbol;
    };
    /**
     * Exposes the Pino package version. Also available on the logger instance.
     */
    const version: string;

    type SerializedError = pinoStdSerializers.SerializedError;
    type SerializedResponse = pinoStdSerializers.SerializedResponse;
    type SerializedRequest = pinoStdSerializers.SerializedRequest;

    /**
     * Provides functions for serializing objects common to many projects.
     */
    const stdSerializers: {
        /**
         * Generates a JSONifiable object from the HTTP `request` object passed to the `createServer` callback of Node's HTTP server.
         */
        req: typeof pinoStdSerializers.req;
        /**
         * Generates a JSONifiable object from the HTTP `response` object passed to the `createServer` callback of Node's HTTP server.
         */
        res: typeof pinoStdSerializers.res;
        /**
         * Serializes an Error object.
         */
        err: typeof pinoStdSerializers.err;
        /**
         * Returns an object:
         * ```
         * {
         *   req: {}
         * }
         * ```
         * where req is the request as serialized by the standard request serializer.
         * @param req The request to serialize
         * @return An object
         */
        mapHttpRequest: typeof pinoStdSerializers.mapHttpRequest;
        /**
         * Returns an object:
         * ```
         * {
         *   res: {}
         * }
         * ```
         * where res is the response as serialized by the standard response serializer.
         * @param res The response to serialize.
         * @return An object.
         */
        mapHttpResponse: typeof pinoStdSerializers.mapHttpResponse;
        /**
         * A utility method for wrapping the default error serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom error serializer. Accepts a single parameter: the newly serialized
         * error object. Returns the new (or updated) error object.
         * @return A new error serializer.
         */
        wrapErrorSerializer: typeof pinoStdSerializers.wrapErrorSerializer;
        /**
         * A utility method for wrapping the default request serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom request serializer. Accepts a single parameter: the newly serialized
         * request object. Returns the new (or updated) request object.
         * @return A new error serializer.
         */
        wrapRequestSerializer: typeof pinoStdSerializers.wrapRequestSerializer;
        /**
         * A utility method for wrapping the default response serializer. Allows custom serializers to work with the
         * already serialized object.
         * @param customSerializer The custom response serializer. Accepts a single parameter: the newly serialized
         * response object. Returns the new (or updated) response object.
         * @return A new error serializer.
         */
        wrapResponseSerializer: typeof pinoStdSerializers.wrapResponseSerializer;
    };
    /**
     * Provides functions for generating the timestamp property in the log output. You can set the `timestamp` option during
     * initialization to one of these functions to adjust the output format. Alternatively, you can specify your own time function.
     * A time function must synchronously return a string that would be a valid component of a JSON string. For example,
     * the default function returns a string like `,"time":1493426328206`.
     */
    const stdTimeFunctions: {
        /**
         * The default time function for Pino. Returns a string like `,"time":1493426328206`.
         */
        epochTime: TimeFn;
        /*
         * Returns the seconds since Unix epoch
         */
        unixTime: TimeFn;
        /**
         * Returns an empty string. This function is used when the `timestamp` option is set to `false`.
         */
        nullTime: TimeFn;
        /*
         * Returns ISO 8601-formatted time in UTC
         */
        isoTime: TimeFn;
    };

    /**
     * Equivalent of SonicBoom constructor options object
     */
        // TODO: use SonicBoom constructor options interface when available
    interface DestinationObjectOptions {
        fd?: string | number;
        dest?: string;
        minLength?: number;
        sync?: boolean;
    }

    /**
     * Create a Pino Destination instance: a stream-like object with significantly more throughput (over 30%) than a standard Node.js stream.
     * @param [dest]: The `destination` parameter, at a minimum must be an object with a `write` method. An ordinary Node.js
     *                `stream` can be passed as the destination (such as the result of `fs.createWriteStream`) but for peak log
     *                writing performance it is strongly recommended to use `pino.destination` to create the destination stream.
     * @returns A Sonic-Boom  stream to be used as destination for the pino function
     */
    function destination(
        dest?: string | number | DestinationObjectOptions | DestinationStream | NodeJS.WritableStream,
    ): SonicBoom;

    interface TransportTargetOptions<TransportOptions = Record<string, any>> {
        target: string
        options: TransportOptions
        level: LevelWithSilent
    }

    interface TransportBaseOptions<TransportOptions = Record<string, any>> {
        options?: TransportOptions
        worker?: WorkerOptions & { autoEnd?: boolean}
    }

    interface TransportSingleOptions<TransportOptions = Record<string, any>> extends TransportBaseOptions<TransportOptions>{
        target: string
    }

    interface TransportMultiOptions<TransportOptions = Record<string, any>> extends TransportBaseOptions<TransportOptions>{
        targets: readonly TransportTargetOptions<TransportOptions>[]
    }

    // ToDo https://github.com/pinojs/thread-stream/issues/24
    type ThreadStream = any

    function transport<TransportOptions = Record<string, any>>(
        options: TransportSingleOptions<TransportOptions> | TransportMultiOptions<TransportOptions>
    ): ThreadStream

    interface MultiStreamOptions {
        levels?: Record<string, number>
        dedupe?: boolean
    }

    interface StreamEntry {
        stream: WriteStream
        level: Level
    }

    interface MultiStreamRes {
        write: (data: any) => void,
        add: (dest: Record<string, any>) => MultiStreamRes,
        flushSync: () => void,
        minLevel: number,
        streams: WriteStream[],
        clone(level: Level): MultiStreamRes,
    }

    function multistream(
        streamsArray: StreamEntry[], opts: P.MultiStreamOptions
    ): MultiStreamRes

    /**
     * The pino.final method can be used to create an exit listener function.
     * This listener function can be supplied to process exit events.
     * The exit listener function will call the handler with
     * @param [logger]: pino logger that serves as reference for the final logger
     * @param [handler]: Function that will be called by the handler returned from this function
     * @returns Exit listener function that can be supplied to process exit events and will call the supplied handler function
     */
    function final(
        logger: Logger,
        handler: (error: Error, finalLogger: Logger, ...args: any[]) => void,
    ): (error: Error | null, ...args: any[]) => void;

    /**
     * The pino.final method can be used to acquire a final logger instance that synchronously flushes on every write.
     * @param [logger]: pino logger that serves as reference for the final logger
     * @returns Final, synchronous logger
     */
    function final(logger: Logger): Logger;

    interface LevelMapping {
        /**
         * Returns the mappings of level names to their respective internal number representation.
         */
        values: { [level: string]: number };
        /**
         * Returns the mappings of level internal level numbers to their string representations.
         */
        labels: { [level: number]: string };
    }
    type TimeFn = () => string;
    type MixinFn = () => object;

    interface DestinationStream {
        write(msg: string): void;
    }

    interface LoggerOptions {
        /**
         * Avoid error causes by circular references in the object tree. Default: `true`.
         */
        safe?: boolean;
        /**
         * The name of the logger. Default: `undefined`.
         */
        name?: string;
        /**
         * an object containing functions for custom serialization of objects.
         * These functions should return an JSONifiable object and they should never throw. When logging an object,
         * each top-level property matching the exact key of a serializer will be serialized using the defined serializer.
         */
        serializers?: { [key: string]: SerializerFn };
        /**
         * Enables or disables the inclusion of a timestamp in the log message. If a function is supplied, it must
         * synchronously return a JSON string representation of the time. If set to `false`, no timestamp will be included in the output.
         * See stdTimeFunctions for a set of available functions for passing in as a value for this option.
         * Caution: any sort of formatted time will significantly slow down Pino's performance.
         */
        timestamp?: TimeFn | boolean;
        /**
         * One of the supported levels or `silent` to disable logging. Any other value defines a custom level and
         * requires supplying a level value via `levelVal`. Default: 'info'.
         */
        level?: LevelWithSilent | string;

        /**
         * Use this option to define additional logging levels.
         * The keys of the object correspond the namespace of the log level, and the values should be the numerical value of the level.
         */
        customLevels?: { [key: string]: number };
        /**
         * Use this option to only use defined `customLevels` and omit Pino's levels.
         * Logger's default `level` must be changed to a value in `customLevels` in order to use `useOnlyCustomLevels`
         * Warning: this option may not be supported by downstream transports.
         */
        useOnlyCustomLevels?: boolean;

        /**
         * If provided, the `mixin` function is called each time one of the active logging methods
         * is called. The function must synchronously return an object. The properties of the
         * returned object will be added to the logged JSON.
         */
        mixin?: MixinFn;

        /**
         * As an array, the redact option specifies paths that should have their values redacted from any log output.
         *
         * Each path must be a string using a syntax which corresponds to JavaScript dot and bracket notation.
         *
         * If an object is supplied, three options can be specified:
         *
         *      paths (String[]): Required. An array of paths
         *      censor (String): Optional. A value to overwrite key which are to be redacted. Default: '[Redacted]'
         *      remove (Boolean): Optional. Instead of censoring the value, remove both the key and the value. Default: false
         */
        redact?: string[] | redactOptions;

        /**
         * When defining a custom log level via level, set to an integer value to define the new level. Default: `undefined`.
         */
        levelVal?: number;
        /**
         * The string key for the 'message' in the JSON object. Default: "msg".
         */
        messageKey?: string;
        /**
         * The string key to place any logged object under.
         */
        nestedKey?: string;
        /**
         * Enables pino.pretty. This is intended for non-production configurations. This may be set to a configuration
         * object as outlined in http://getpino.io/#/docs/API?id=pretty. Default: `false`.
         */
        prettyPrint?: boolean | PrettyOptions;
        /**
         * Allows to optionally define which prettifier module to use.
         */
        // TODO: use type definitions from 'pino-pretty' when available.
        prettifier?: any;
        /**
         * Enables logging. Default: `true`.
         */
        enabled?: boolean;
        /**
         * Browser only, see http://getpino.io/#/docs/browser.
         */
        browser?: {
            /**
             * The `asObject` option will create a pino-like log object instead of passing all arguments to a console
             * method. When `write` is set, `asObject` will always be true.
             *
             * @example
             * pino.info('hi') // creates and logs {msg: 'hi', level: 30, time: <ts>}
             */
            asObject?: boolean;
            /**
             * Instead of passing log messages to `console.log` they can be passed to a supplied function. If `write` is
             * set to a single function, all logging objects are passed to this function. If `write` is an object, it
             * can have methods that correspond to the levels. When a message is logged at a given level, the
             * corresponding method is called. If a method isn't present, the logging falls back to using the `console`.
             *
             * @example
             * const pino = require('pino')({
             *   browser: {
             *     write: (o) => {
             *       // do something with o
             *     }
             *   }
             * })
             *
             * @example
             * const pino = require('pino')({
             *   browser: {
             *     write: {
             *       info: function (o) {
             *         //process info log object
             *       },
             *       error: function (o) {
             *         //process error log object
             *       }
             *     }
             *   }
             * })
             */
            write?:
                | WriteFn
                | ({
                fatal?: WriteFn;
                error?: WriteFn;
                warn?: WriteFn;
                info?: WriteFn;
                debug?: WriteFn;
                trace?: WriteFn;
            } & { [logLevel: string]: WriteFn });

            /**
             * The serializers provided to `pino` are ignored by default in the browser, including the standard
             * serializers provided with Pino. Since the default destination for log messages is the console, values
             * such as `Error` objects are enhanced for inspection, which they otherwise wouldn't be if the Error
             * serializer was enabled. We can turn all serializers on or we can selectively enable them via an array.
             *
             * When `serialize` is `true` the standard error serializer is also enabled (see
             * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#pino-stdserializers}). This is a global
             * serializer which will apply to any `Error` objects passed to the logger methods.
             *
             * If `serialize` is an array the standard error serializer is also automatically enabled, it can be
             * explicitly disabled by including a string in the serialize array: `!stdSerializers.err` (see example).
             *
             * The `serialize` array also applies to any child logger serializers (see
             * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#bindingsserializers-object} for how to
             * set child-bound serializers).
             *
             * Unlike server pino the serializers apply to every object passed to the logger method, if the `asObject`
             * option is `true`, this results in the serializers applying to the first object (as in server pino).
             *
             * For more info on serializers see
             * {@link https://github.com/pinojs/pino/blob/master/docs/api.md#serializers-object}.
             *
             * @example
             * const pino = require('pino')({
             *   browser: {
             *     serialize: true
             *   }
             * })
             *
             * @example
             * const pino = require('pino')({
             *   serializers: {
             *     custom: myCustomSerializer,
             *     another: anotherSerializer
             *   },
             *   browser: {
             *     serialize: ['custom']
             *   }
             * })
             * // following will apply myCustomSerializer to the custom property,
             * // but will not apply anotherSerializer to another key
             * pino.info({custom: 'a', another: 'b'})
             *
             * @example
             * const pino = require('pino')({
             *   serializers: {
             *     custom: myCustomSerializer,
             *     another: anotherSerializer
             *   },
             *   browser: {
             *     serialize: ['!stdSerializers.err', 'custom'] //will not serialize Errors, will serialize `custom` keys
             *   }
             * })
             */
            serialize?: boolean | string[];

            /**
             * Options for transmission of logs.
             *
             * @example
             * const pino = require('pino')({
             *   browser: {
             *     transmit: {
             *       level: 'warn',
             *       send: function (level, logEvent) {
             *         if (level === 'warn') {
             *           // maybe send the logEvent to a separate endpoint
             *           // or maybe analyse the messages further before sending
             *         }
             *         // we could also use the `logEvent.level.value` property to determine
             *         // numerical value
             *         if (logEvent.level.value >= 50) { // covers error and fatal
             *
             *           // send the logEvent somewhere
             *         }
             *       }
             *     }
             *   }
             * })
             */
            transmit?: {
                /**
                 * Specifies the minimum level (inclusive) of when the `send` function should be called, if not supplied
                 * the `send` function will be called based on the main logging `level` (set via `options.level`,
                 * defaulting to `info`).
                 */
                level?: Level | string;
                /**
                 * Remotely record log messages.
                 *
                 * @description Called after writing the log message.
                 */
                send: (level: Level, logEvent: LogEvent) => void;
            };
        };
        /**
         * key-value object added as child logger to each log line. If set to null the base child logger is not added
         */
        base?: { [key: string]: any } | null;

        /**
         * An object containing functions for formatting the shape of the log lines.
         * These functions should return a JSONifiable object and should never throw.
         * These functions allow for full customization of the resulting log lines.
         * For example, they can be used to change the level key name or to enrich the default metadata.
         */
        formatters?: {
            /**
             * Changes the shape of the log level.
             * The default shape is { level: number }.
             * The function takes two arguments, the label of the level (e.g. 'info') and the numeric value (e.g. 30).
             */
            level?: (label: string, number: number) => object;
            /**
             * Changes the shape of the bindings.
             * The default shape is { pid, hostname }.
             * The function takes a single argument, the bindings object.
             * It will be called every time a child logger is created.
             */
            bindings?: (bindings: Bindings) => object;
            /**
             * Changes the shape of the log object.
             * This function will be called every time one of the log methods (such as .info) is called.
             * All arguments passed to the log method, except the message, will be pass to this function.
             * By default it does not change the shape of the log object.
             */
            log?: (object: object) => object;
        };

        /**
         * An object mapping to hook functions. Hook functions allow for customizing internal logger operations.
         * Hook functions must be synchronous functions.
         */
        hooks?: {
            /**
             * Allows for manipulating the parameters passed to logger methods. The signature for this hook is
             * logMethod (args, method, level) {}, where args is an array of the arguments that were passed to the
             * log method and method is the log method itself, and level is the log level. This hook must invoke the method function by
             * using apply, like so: method.apply(this, newArgumentsArray).
             */
            logMethod?: (args: any[], method: LogFn, level: number) => void;
        };
    }

    // Copied from "pino-pretty" types
    type PrettyOptions = {
        /**
         * Hide objects from output (but not error object).
         * @default false
         */
        hideObject?: boolean;
        /**
         * Translate the epoch time value into a human readable date and time string. This flag also can set the format
         * string to apply when translating the date to human readable format. For a list of available pattern letters
         * see the {@link https://www.npmjs.com/package/dateformat|dateformat documentation}.
         * - The default format is `yyyy-mm-dd HH:MM:ss.l o` in UTC.
         * - Requires a `SYS:` prefix to translate time to the local system's timezone. Use the shortcut `SYS:standard`
         *   to translate time to `yyyy-mm-dd HH:MM:ss.l o` in system timezone.
         * @default false
         */
        translateTime?: boolean | string;
        /**
         * If set to true, it will print the name of the log level as the first field in the log line.
         * @default false
         */
        levelFirst?: boolean;
        /**
         * Define the key that contains the level of the log.
         * @default "level"
         */
        levelKey?: string;
        /**
         * Output the log level using the specified label.
         * @default "levelLabel"
         */
        levelLabel?: string;
        /**
         * The key in the JSON object to use as the highlighted message.
         * @default "msg"
         */
        messageKey?: string;
        /**
         * Print each log message on a single line (errors will still be multi-line).
         * @default false
         */
        singleLine?: boolean;
        /**
         * The key in the JSON object to use for timestamp display.
         * @default "time"
         */
        timestampKey?: string;
        /**
         * Format output of message, e.g. {level} - {pid} will output message: INFO - 1123
         * @default false
         *
         * @example
         * ```typescript
         * {
         *   messageFormat: (log, messageKey) => {
         *     const message = log[messageKey];
         *     if (log.requestId) return `[${log.requestId}] ${message}`;
         *     return message;
         *   }
         * }
         * ```
         */
        messageFormat?: false | string | MessageFormatFunc;
        /**
         * If set to true, will add color information to the formatted output message.
         * @default false
         */
        colorize?: boolean;
        /**
         * Appends carriage return and line feed, instead of just a line feed, to the formatted log line.
         * @default false
         */
        crlf?: boolean;
        /**
         * Define the log keys that are associated with error like objects.
         * @default ["err", "error"]
         */
        errorLikeObjectKeys?: string[];
        /**
         *  When formatting an error object, display this list of properties.
         *  The list should be a comma separated list of properties.
         * @default ""
         */
        errorProps?: string;
        /**
         * Specify a search pattern according to {@link http://jmespath.org|jmespath}
         */
        search?: string;
        /**
         * Ignore one or several keys.
         * @example "time,hostname"
         */
        ignore?: string;
    }

    type Level = "fatal" | "error" | "warn" | "info" | "debug" | "trace";
    type LevelWithSilent = Level | "silent";

    type SerializerFn = (value: any) => any;
    type WriteFn = (o: object) => void;

    /**
     * Describes a log line.
     */
    type LogDescriptor = Record<string, any>; // TODO replace `any` with `unknown` when TypeScript version >= 3.0

    interface Bindings {
        [key: string]: any;
    }

    interface ChildLoggerOptions {
        level?: Level | string;
        serializers?: { [key: string]: SerializerFn };
        customLevels?: { [key: string]: number };
        formatters?: {
            level?: (label: string, number: number) => object;
            bindings?: (bindings: Bindings) => object;
            log?: (object: object) => object;
        };
        redact?: string[] | redactOptions;
    }

    /**
     * A data structure representing a log message, it represents the arguments passed to a logger statement, the level
     * at which they were logged and the hierarchy of child bindings.
     *
     * @description By default serializers are not applied to log output in the browser, but they will always be applied
     * to `messages` and `bindings` in the `logEvent` object. This allows  us to ensure a consistent format for all
     * values between server and client.
     */
    interface LogEvent {
        /**
         * Unix epoch timestamp in milliseconds, the time is taken from the moment the logger method is called.
         */
        ts: number;
        /**
         * All arguments passed to logger method, (for instance `logger.info('a', 'b', 'c')` would result in `messages`
         * array `['a', 'b', 'c']`).
         */
        messages: any[];
        /**
         * Represents each child logger (if any), and the relevant bindings.
         *
         * @description For instance, given `logger.child({a: 1}).child({b: 2}).info({c: 3})`, the bindings array would
         * hold `[{a: 1}, {b: 2}]` and the `messages` array would be `[{c: 3}]`. The `bindings` are ordered according to
         * their position in the child logger hierarchy, with the lowest index being the top of the hierarchy.
         */
        bindings: Bindings[];
        /**
         * Holds the `label` (for instance `info`), and the corresponding numerical `value` (for instance `30`).
         * This could be important in cases where client side level values and labels differ from server side.
         */
        level: {
            label: string;
            value: number;
        };
    }

    type Logger = BaseLogger & LoggerExtras & Record<string, any>;

    interface BaseLogger {
        /**
         * Set this property to the desired logging level. In order of priority, available levels are:
         *
         * - 'fatal'
         * - 'error'
         * - 'warn'
         * - 'info'
         * - 'debug'
         * - 'trace'
         *
         * The logging level is a __minimum__ level. For instance if `logger.level` is `'info'` then all `'fatal'`, `'error'`, `'warn'`,
         * and `'info'` logs will be enabled.
         *
         * You can pass `'silent'` to disable logging.
         */
        level: LevelWithSilent | string;

        /**
         * Log at `'fatal'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        fatal: LogFn;
        /**
         * Log at `'error'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        error: LogFn;
        /**
         * Log at `'warn'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        warn: LogFn;
        /**
         * Log at `'info'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        info: LogFn;
        /**
         * Log at `'debug'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        debug: LogFn;
        /**
         * Log at `'trace'` level the given msg. If the first argument is an object, all its properties will be included in the JSON line.
         * If more args follows `msg`, these will be used to format `msg` using `util.format`.
         *
         * @typeParam T: the interface of the object being serialized. Default is object.
         * @param obj: object to be serialized
         * @param msg: the log message to write
         * @param ...args: format string values when `msg` is a format string
         */
        trace: LogFn;
        /**
         * Noop function.
         */
        silent: LogFn;
    }

    interface LoggerExtras extends EventEmitter {
        /**
         * Exposes the Pino package version. Also available on the exported pino function.
         */
        readonly version: string;

        levels: LevelMapping;

        /**
         * Outputs the level as a string instead of integer.
         */
        useLevelLabels: boolean;
        /**
         * Define additional logging levels.
         */
        customLevels: { [key: string]: number };
        /**
         * Use only defined `customLevels` and omit Pino's levels.
         */
        useOnlyCustomLevels: boolean;
        /**
         * Returns the integer value for the logger instance's logging level.
         */
        levelVal: number;

        /**
         * Creates a child logger, setting all key-value pairs in `bindings` as properties in the log lines. All serializers will be applied to the given pair.
         * Child loggers use the same output stream as the parent and inherit the current log level of the parent at the time they are spawned.
         * From v2.x.x the log level of a child is mutable (whereas in v1.x.x it was immutable), and can be set independently of the parent.
         * If a `level` property is present in the object passed to `child` it will override the child logger level.
         *
         * @param bindings: an object of key-value pairs to include in log lines as properties.
         * @param options: an options object that will override child logger inherited options.
         * @returns a child logger instance.
         */
        child(bindings: Bindings, options?: ChildLoggerOptions): Logger;

        /**
         * Registers a listener function that is triggered when the level is changed.
         * Note: When browserified, this functionality will only be available if the `events` module has been required elsewhere
         * (e.g. if you're using streams in the browser). This allows for a trade-off between bundle size and functionality.
         *
         * @param event: only ever fires the `'level-change'` event
         * @param listener: The listener is passed four arguments: `levelLabel`, `levelValue`, `previousLevelLabel`, `previousLevelValue`.
         */
        on(event: "level-change", listener: LevelChangeEventListener): this;
        addListener(event: "level-change", listener: LevelChangeEventListener): this;
        once(event: "level-change", listener: LevelChangeEventListener): this;
        prependListener(event: "level-change", listener: LevelChangeEventListener): this;
        prependOnceListener(event: "level-change", listener: LevelChangeEventListener): this;
        removeListener(event: "level-change", listener: LevelChangeEventListener): this;

        /**
         * A utility method for determining if a given log level will write to the destination.
         */
        isLevelEnabled(level: LevelWithSilent | string): boolean;

        /**
         * Returns an object containing all the current bindings, cloned from the ones passed in via logger.child().
         */
        bindings(): Bindings;
    }

    type LevelChangeEventListener = (
        lvl: LevelWithSilent | string,
        val: number,
        prevLvl: LevelWithSilent | string,
        prevVal: number,
    ) => void;

    interface LogFn {
        /* tslint:disable:no-unnecessary-generics */
        <T extends object>(obj: T, msg?: string, ...args: any[]): void;
        (obj: unknown, msg?: string, ...args: any[]): void;
        (msg: string, ...args: any[]): void;
    }

    interface redactOptions {
        paths: string[];
        censor?: string | ((v: any) => any);
        remove?: boolean;
    }
}

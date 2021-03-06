/// <reference types="node" />

import { IPublishPacket, ISubscribePacket, ISubscription, IUnsubscribePacket } from 'mqtt-packet'
import { Duplex } from 'stream'
import EventEmitter = NodeJS.EventEmitter

declare enum AuthErrorCode {
  UNNACCEPTABLE_PROTOCOL = 1,
  IDENTIFIER_REJECTED = 2,
  SERVER_UNAVAILABLE = 3,
  BAD_USERNAME_OR_PASSWORD = 4
}

interface Client extends EventEmitter {
  id: string
  clean: boolean

  on (event: 'error', cb: (err: Error) => void): this

  publish (message: IPublishPacket, callback?: () => void): void
  subscribe (
    subscriptions: ISubscription | ISubscription[] | ISubscribePacket,
    callback?: () => void
  ): void
  unsubscribe (topicObjects: ISubscription | ISubscription[], callback?: () => void): void
  close (callback?: () => void): void
}

type AuthenticateCallback = (
  client: Client,
  username: string,
  password: string,
  done: (err: Error & { returnCode: AuthErrorCode } | null, success: boolean | null) => void
) => void

type AuthorizePublishCallback = (client: Client, packet: IPublishPacket, done: (err?: Error | null) => void) => void

type AuthorizeSubscribeCallback = (client: Client, subscription: ISubscription, done: (err: Error | null, subscription?: ISubscription | null) => void) => void

type AuthorizeForwardCallback = (client: Client, packet: IPublishPacket) => IPublishPacket | null | void

type PublishedCallback = (packet: IPublishPacket, client: Client, done: () => void) => void

interface AedesOptions {
  mq?: any
  persistence?: any
  concurrency?: number
  heartbeatInterval?: number
  connectTimeout?: number
  authenticate?: AuthenticateCallback
  authorizePublish?: AuthorizePublishCallback
  authorizeSubscribe?: AuthorizeSubscribeCallback
  authorizeForward?: AuthorizeForwardCallback
  published?: PublishedCallback
}

interface Aedes extends EventEmitter {
  handle: (stream: Duplex) => void

  authenticate: AuthenticateCallback
  authorizePublish: AuthorizePublishCallback
  authorizeSubscribe: AuthorizeSubscribeCallback
  authorizeForward: AuthorizeForwardCallback
  published: PublishedCallback

  on (event: 'closed', cb: () => void): this
  on (event: 'client' | 'clientDisconnect' | 'keepaliveTimeout' | 'connackSent', cb: (client: Client) => void): this
  on (event: 'clientError' | 'connectionError', cb: (client: Client, error: Error) => void): this
  on (event: 'ping' | 'publish' | 'ack', cb: (packet: any, client: Client) => void): this
  on (event: 'subscribe' | 'unsubscribe', cb: (subscriptions: ISubscription | ISubscription[] | ISubscribePacket, client: Client) => void): this

  publish (packet: IPublishPacket & { topic: string | Buffer }, done: () => void): void
  subscribe (topic: string, callback: (packet: ISubscribePacket, cb: () => void) => void, done: () => void): void
  unsubscribe (
    topic: string,
    callback: (packet: IUnsubscribePacket, cb: () => void) => void,
    done: () => void
  ): void
  close (callback?: () => void): void
}

declare function aedes (options?: AedesOptions): Aedes

export = aedes

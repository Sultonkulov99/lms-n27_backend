import { Injectable, OnModuleDestroy, OnModuleInit } from "@nestjs/common";
import Redis from "ioredis";

@Injectable()
export class RedisService implements OnModuleInit, OnModuleDestroy {
    private client: Redis;

    async onModuleInit() {
        this.client = new Redis({
            host: process.env.REDIS_HOST || 'localhost',
            port: Number(process.env.REDIS_PORT || 6379),
            lazyConnect: true,

            retryStrategy(times) {
                if (times > 5) {
                    console.error('❌ Redis reconnect stopped');
                    return null; // reconnectni to‘xtat
                }
                return Math.min(times * 300, 3000);
            },
        })

        this.client.on('connect', () => {
            console.log("Redis Connected ✅")
        })

        this.client.on('error', () => {
            console.error("Redis Error ❌")
        })

        await this.client.connect();
    }

    async onModuleDestroy() {
        await this.client.quit();
    }

    async set(key: string, value: string, seconds: number) {
        return this.client.set(key, value, 'EX', seconds);
    }

    async get(key: string) {
        return this.client.get(key);
    }

    async del(key: string) {
        return this.client.del(key);
    }
}
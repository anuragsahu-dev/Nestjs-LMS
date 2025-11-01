import { Injectable, OnModuleInit, OnModuleDestroy } from "@nestjs/common";
import { ConfigService } from "@nestjs/config";
import * as amqp from "amqp-connection-manager";
import { Channel, Options } from "amqplib";

@Injectable()
export class RabbitmqService implements OnModuleInit, OnModuleDestroy {
  private connection: amqp.AmqpConnectionManager;
  private channelWrapper: amqp.ChannelWrapper;

  constructor(private readonly configService: ConfigService) {}

  async onModuleInit() {
    const url = this.configService.getOrThrow<string>("rabbitmq.url");

    this.connection = amqp.connect([url]);

    this.connection.on("connect", () => console.log("RabbitMQ connected"));
    this.connection.on("disconnect", (err) =>
      console.error("RabbitMQ disconnected:", err?.err?.message),
    );

    this.channelWrapper = this.connection.createChannel({
      json: true,
      setup: async (channel: Channel) => {
        await channel.assertExchange("otp_exchange", "direct", { durable: true });
        await channel.assertExchange("payment_exchange", "direct", { durable: true });
        await channel.assertExchange("video_exchange", "fanout", { durable: true });
        // You can add more exchanges here as needed (e.g., marketing_exchange)
      },
    });
  }

  // Send to specific queue directly
  async sendToQueue(queue: string, message: unknown) {
    await this.channelWrapper.addSetup((channel: Channel) =>
      channel.assertQueue(queue, { durable: true }),
    );

    // Proper typing for sendToQueue options (amqplib.Options.Publish)
    const options: Options.Publish = { persistent: true };

    await this.channelWrapper.sendToQueue(queue, message, options);
  }

  // Publish to an exchange with routing key
  async publish(exchange: string, routingKey: string, message: unknown) {
    const options: Options.Publish = { persistent: true };
    await this.channelWrapper.publish(exchange, routingKey, message, options);
  }

  // Consume from queue
  async consume<T>(
    queue: string,
    exchange: string,
    routingKey: string,
    handler: (msg: T) => Promise<void>,
  ) {
    await this.channelWrapper.addSetup(async (channel: Channel) => {
      await channel.assertExchange(exchange, "topic", { durable: true });
      await channel.assertQueue(queue, { durable: true });
      await channel.bindQueue(queue, exchange, routingKey);

      await channel.consume(queue, async (msg) => {
        if (!msg) return;
        try {
          const content = JSON.parse(msg.content.toString()) as T;
          await handler(content);
          channel.ack(msg);
        } catch (err) {
          channel.nack(msg, false, false);
        }
      });
    });
  }

  async onModuleDestroy() {
    await this.connection.close();
  }
}

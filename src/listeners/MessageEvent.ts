import { IMessage } from "../../typings";
import { DefineListener } from "../utils/decorators/DefineListener";
import { createEmbed } from "../utils/createEmbed";
import { BaseListener } from "../structures/BaseListener";
import { User } from "discord.js";

@DefineListener("message")
export class MessageEvent extends BaseListener {
    public async execute(message: IMessage): Promise<any> {
        if (message.author.bot || message.channel.type !== "text") return message;
        if ((await this.getUserFromMention(message.content))?.id === message.client.user?.id) {
            return message.channel.send(
                createEmbed("info", `👋  **|**  Hi there, my prefix is **\`${this.client.config.prefix}\`**`)
            );
        }
        if (!message.content.toLowerCase().startsWith(this.client.config.prefix)) return message;
        return this.client.commands.handle(message);
    }

    private getUserFromMention(mention: string): Promise<User | undefined> {
        const matches = /^<@!?(\d+)>$/.exec(mention);
        if (!matches) return Promise.resolve(undefined);

        const id = matches[1];
        return this.client.users.fetch(id);
    }
}

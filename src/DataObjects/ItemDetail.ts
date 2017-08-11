export class ItemDetail {
  id: number;
  name: string;
  description?: string;
  chat_link: string;
  type: string;
  level: number;
  rarity: string;
  icon: string;
  flags: string[];

  tradeable(): boolean {
    return (
      !this.flags.includes('AccountBound') &&
      !this.flags.includes('SoulbindOnAcquire')
    );
  }
}

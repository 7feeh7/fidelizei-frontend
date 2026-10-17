import { GrantedReward } from "interfaces/customerRewards";

export function formatGrantedRewardsMessage(rewards: GrantedReward[]): string {
  if (rewards.length === 0) {
    return "";
  }

  if (rewards.length === 1) {
    return `Novo benefício concedido: ${rewards[0].preview}`;
  }

  const previews = rewards.map((reward) => reward.preview).join(" ");
  return `Novos benefícios concedidos: ${previews}`;
}

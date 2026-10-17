import {
  CreateReferralPayload,
  ReferralListItem,
  ReferralServices,
  ReferralStatus,
} from "interfaces/referrals";
import { delay } from "./delay";

let referrals: ReferralListItem[] = [
  {
    id: "ref-1",
    referrerId: "1",
    referrerName: "Ana Lima",
    referredId: "2",
    referredName: "Bruno Souza",
    status: "PENDING",
    createdAt: "2026-10-01T12:00:00.000Z",
    convertedAt: null,
  },
];

const PAGE_SIZE = 10;

function filterReferrals(
  status?: ReferralStatus,
  referrerId?: string
): ReferralListItem[] {
  return referrals.filter((referral) => {
    if (status && referral.status !== status) {
      return false;
    }
    if (referrerId && referral.referrerId !== referrerId) {
      return false;
    }
    return true;
  });
}

export const mockReferralServices: ReferralServices = {
  async list({ page = 1, status, referrerId } = {}) {
    await delay();
    const filtered = filterReferrals(status, referrerId);
    const start = (page - 1) * PAGE_SIZE;
    const data = filtered.slice(start, start + PAGE_SIZE);
    const totalPages =
      filtered.length === 0 ? 0 : Math.ceil(filtered.length / PAGE_SIZE);

    return {
      data,
      page,
      totalPages,
    };
  },
  async create(payload: CreateReferralPayload) {
    await delay();
    if (payload.referrerId === payload.referredId) {
      throw new Error("Indicador e indicado devem ser clientes diferentes");
    }
    if (referrals.some((item) => item.referredId === payload.referredId)) {
      throw new Error("Este cliente já foi indicado");
    }

    referrals = [
      {
        id: crypto.randomUUID(),
        referrerId: payload.referrerId,
        referrerName: "Cliente indicador",
        referredId: payload.referredId,
        referredName: "Cliente indicado",
        status: "PENDING",
        createdAt: new Date().toISOString(),
        convertedAt: null,
      },
      ...referrals,
    ];
  },
  async cancel(id: string) {
    await delay();
    const referral = referrals.find((item) => item.id === id);
    if (!referral) {
      throw new Error("Indicação não encontrada");
    }
    if (referral.status !== "PENDING") {
      throw new Error("Somente indicações pendentes podem ser canceladas");
    }
    referral.status = "CANCELED";
  },
};

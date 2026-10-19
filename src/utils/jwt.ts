import { MeResponse, User } from "interfaces/auth";

interface AccessTokenPayload {
	sub?: string;
	email?: string;
}

export function parseAccessTokenPayload(token: string): AccessTokenPayload {
	try {
		const segment = token.split(".")[1];
		if (!segment) {
			return {};
		}

		const normalized = segment.replace(/-/g, "+").replace(/_/g, "/");
		const json = atob(normalized);
		return JSON.parse(json) as AccessTokenPayload;
	} catch {
		return {};
	}
}

export function userFromMe(me: MeResponse): User {
	return {
		id: me.id,
		name: me.name,
		email: me.email,
	};
}

export function userFromAccessToken(token: string, fallbackEmail?: string): User {
	const payload = parseAccessTokenPayload(token);
	const email = payload.email ?? fallbackEmail ?? "";
	const localPart = email.split("@")[0];

	return {
		id: payload.sub ?? email,
		email,
		name: localPart
			? localPart.charAt(0).toUpperCase() + localPart.slice(1)
			: "Usuário",
	};
}

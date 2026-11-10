import { useSearchParams } from "react-router-dom";

/** nome do parâmetro de URL que guarda a aba ativa (ex.: /mensagens?aba=modelos) */
export const TAB_PARAM = "aba";

/**
 * Guarda a aba ativa na URL, para o voltar do navegador funcionar
 * e permitir link direto para uma aba.
 * A primeira aba da lista é a padrão e não aparece na URL.
 */
export function useTabParam<T extends string>(tabs: readonly T[]) {
  const [searchParams, setSearchParams] = useSearchParams();
  const defaultTab = tabs[0];
  const current = searchParams.get(TAB_PARAM) as T | null;
  const tab = current && tabs.includes(current) ? current : defaultTab;

  function setTab(next: T) {
    setSearchParams((previous) => {
      const params = new URLSearchParams(previous);

      if (next === defaultTab) {
        params.delete(TAB_PARAM);
      } else {
        params.set(TAB_PARAM, next);
      }

      return params;
    });
  }

  return [tab, setTab] as const;
}

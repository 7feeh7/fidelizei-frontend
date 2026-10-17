import {
  createSearchParams,
  URLSearchParamsInit,
  useNavigate,
  useSearchParams,
} from "react-router-dom";
import qs from "qs";

export function useQueryParams() {
  const [searchParams] = useSearchParams();
  const baseNavigate = useNavigate();

  function get(): Record<string, string> {
    return Object.fromEntries([...searchParams]);
  }

  function set(params: URLSearchParamsInit) {
    return `?${createSearchParams(params)}`;
  }

  const navigate = (pathname: string, params?: URLSearchParamsInit) => {
    return baseNavigate({ pathname, search: params ? set(params) : "" });
  };

  const openNewTab = (pathname: string, params?: Record<string, unknown>) => {
    window.open(`${pathname}?${qs.stringify(params)}`, "_blank");
  };

  return {
    get,
    set,
    navigate,
    openNewTab,
    baseNavigate,
  };
}

import { UIEvent } from "react";

export function scrolledToEnd(event: UIEvent<HTMLElement>) {
  const { scrollTop, clientHeight, scrollHeight } = event.currentTarget;
  // tolerância de 1px por causa de arredondamento em telas com zoom
  return scrollHeight - scrollTop - clientHeight <= 1;
}

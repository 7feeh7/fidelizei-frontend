export interface ExampleItem {
  id: number;
  name: string;
  status: "ativo" | "inativo";
  createdAt: string;
}

export interface ExampleServices {
  list(search?: string): Promise<ExampleItem[]>;
  remove(id: number): Promise<void>;
}

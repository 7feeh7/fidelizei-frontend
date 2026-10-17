import * as Yup from "yup";

export const LEAD_SOURCES = [
  "INDICACAO",
  "INSTAGRAM",
  "PANFLETO",
  "OUTRO",
] as const;

export type LeadSource = (typeof LEAD_SOURCES)[number];

export const LEAD_SOURCE_OPTIONS: { label: string; value: LeadSource }[] = [
  { label: "Indicação", value: "INDICACAO" },
  { label: "Instagram", value: "INSTAGRAM" },
  { label: "Panfleto", value: "PANFLETO" },
  { label: "Outro", value: "OUTRO" },
];

export const createCustomerValidator = Yup.object({
  name: Yup.string().trim().required("Nome obrigatório"),
  phone: Yup.string()
    .trim()
    .required("WhatsApp obrigatório")
    .min(10, "WhatsApp inválido"),
  leadSource: Yup.mixed<LeadSource>()
    .oneOf([...LEAD_SOURCES], "Selecione como conheceu o salão")
    .required("Selecione como conheceu o salão"),
  dateOfBirth: Yup.string().nullable().optional(),
});

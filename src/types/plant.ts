export type CareInfo = {
  rega: string;
  luz: string;
  temperatura: string;
  solo_e_adubo: string;
  umidade: string;
  toxicidade: string;
  problemas_comuns: string;
  dicas_extra: string;
};

export type Plant = {
  id: string;
  user_id: string;
  name: string;
  scientific_name: string | null;
  purchase_date: string;
  photo_path: string;
  notes: string | null;
  identification_confidence: number | null;
  care_info: CareInfo | null;
  created_at: string;
  updated_at: string;
};

export type IdentificationCandidate = {
  scientificName: string;
  commonNames: string[];
  score: number;
};

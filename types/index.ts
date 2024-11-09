export type LeadType = {
  id: string;
  board_id: string;
  column_id: string;
  nome: string;
  telefone?: string;
  chat_id?: string;
  descricao?: string;
  origem: 'whatsapp' | 'manual';
  position: number;
  created_at?: string;
  updated_at?: string;
};

export type ColumnType = {
  id: string;
  board_id: string;
  title: string;
  status: string;
  position: number;
  created_at?: string;
  updated_at?: string;
};

export type BoardType = {
  id: string;
  organization_id: string;
  name: string;
  description?: string;
  created_at?: string;
  updated_at?: string;
};

export interface ColumnProps {
  column: ColumnType;
  leads: LeadType[];
  setLeads: React.Dispatch<React.SetStateAction<LeadType[]>>;
  boardId: string;
}

export interface LeadCardProps extends LeadType {
  onDragStart: (e: React.DragEvent, lead: LeadType) => void;
}

export interface DropIndicatorProps {
  beforeId: string | null;
  column: string;
}
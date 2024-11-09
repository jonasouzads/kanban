// lib/api.ts
import { supabase } from './supabase';
import { LeadType, ColumnType } from '@/types';

export const boardApi = {
  // Buscar colunas de um board
  async getColumns(boardId: string): Promise<ColumnType[]> {
    const { data, error } = await supabase
      .from('columns')
      .select('*')
      .eq('board_id', boardId)
      .order('position');
    
    if (error) throw error;
    return data;
  },

  // Buscar leads de um board
  async getLeads(boardId: string): Promise<LeadType[]> {
    const { data, error } = await supabase
      .from('leads')
      .select(`
        *,
        columns (
          id,
          titulo,
          status
        )
      `)
      .eq('board_id', boardId)
      .order('position');
    
    if (error) throw error;
    return data;
  },

  // Adicionar uma nova coluna
  async addColumn(column: Omit<ColumnType, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('columns')
      .insert(column)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Adicionar um novo lead
  async addLead(lead: Omit<LeadType, 'id' | 'created_at' | 'updated_at'>) {
    const { data, error } = await supabase
      .from('leads')
      .insert(lead)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Atualizar um lead
  async updateLead(leadId: string, updates: Partial<LeadType>) {
    const { data, error } = await supabase
      .from('leads')
      .update(updates)
      .eq('id', leadId)
      .select()
      .single();
    
    if (error) throw error;
    return data;
  },

  // Deletar um lead
  async deleteLead(leadId: string) {
    const { error } = await supabase
      .from('leads')
      .delete()
      .eq('id', leadId);
    
    if (error) throw error;
  },

  async updateLeadsPositions(updates: { id: string; position: number; column_id: string }[]) {
    const { data, error } = await supabase.rpc('update_lead_positions', {
      updates_json: JSON.stringify(updates)
    });
    
    if (error) throw error;
    return data;
  },

  // Método alternativo caso a função RPC não funcione
  async updateLeadsPositionsManual(updates: { id: string; position: number; column_id: string }[]) {
    const updatePromises = updates.map(({ id, position, column_id }) =>
      supabase
        .from('leads')
        .update({ position, column_id })
        .eq('id', id)
    );

    await Promise.all(updatePromises);
  }
};
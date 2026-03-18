import { Injectable } from '@angular/core';
import { SupabaseClient } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

export interface Review {
  id: string;
  user_id: string;
  user_name: string;
  rating: number;
  text: string;
  created_at: string;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly sb: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.sb = supabaseService.client;
  }

  async getAll(): Promise<Review[]> {
    const { data, error } = await this.sb
      .from('reviews')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error('Error cargando reseñas:', error.message);
      return [];
    }
    return (data as Review[]) ?? [];
  }

  async add(userId: string, userName: string, rating: number, text: string) {
    return this.sb.from('reviews').insert([{ user_id: userId, user_name: userName, rating, text }]);
  }
}

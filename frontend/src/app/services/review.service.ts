import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export interface Review {
  id: string;
  userId: string;
  userName: string;
  rating: number;
  text: string;
  createdAt: string;
  updatedAt?: string;
}

export interface ReviewStats {
  total: number;
  averageRating: number;
}

@Injectable({ providedIn: 'root' })
export class ReviewService {
  private readonly base = `${environment.apiUrl}/reviews`;

  constructor(private http: HttpClient, private supabase: SupabaseService) {}

  private async authHeaders(): Promise<HttpHeaders> {
    const { data } = await this.supabase.client.auth.getSession();
    const token = data.session?.access_token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  async getAll(): Promise<Review[]> {
    try {
      const data = await firstValueFrom(this.http.get<Review[]>(this.base));
      return data ?? [];
    } catch (err) {
      console.error('Error cargando reseñas:', err);
      return [];
    }
  }

  async getStats(): Promise<ReviewStats> {
    try {
      return await firstValueFrom(this.http.get<ReviewStats>(`${this.base}/stats`));
    } catch {
      return { total: 0, averageRating: 0 };
    }
  }

  async add(userId: string, userName: string, rating: number, text: string): Promise<{ error?: string }> {
    try {
      // X-User-Id como fallback si el JWT no se valida en backend
      const headers = (await this.authHeaders()).set('X-User-Id', userId);
      await firstValueFrom(
        this.http.post<Review>(this.base, { userId, userName, rating, text }, { headers })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al publicar la reseña' };
    }
  }

  async update(id: string, userId: string, userName: string, rating: number, text: string): Promise<{ error?: string }> {
    try {
      const headers = (await this.authHeaders()).set('X-User-Id', userId);
      await firstValueFrom(
        this.http.put<Review>(`${this.base}/${id}`, { userName, rating, text }, { headers })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al editar la reseña' };
    }
  }

  /** Sincroniza el userName en todas las reseñas y comentarios del usuario */
  async syncUserName(userId: string, oldName: string, newName: string): Promise<void> {
    try {
      const headers = (await this.authHeaders()).set('X-User-Id', userId);
      await firstValueFrom(
        this.http.patch(`${this.base}/username`, { oldName, userName: newName }, { headers })
      );
    } catch { /* silencioso — no crítico */ }
  }

  async delete(id: string, userId: string): Promise<{ error?: string }> {
    try {
      const headers = (await this.authHeaders()).set('X-User-Id', userId);
      await firstValueFrom(
        this.http.delete(`${this.base}/${id}`, { headers })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al eliminar la reseña' };
    }
  }
}

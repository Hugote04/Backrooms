import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export interface Comment {
  id: string;
  reviewId: string;
  userId: string;
  userName: string;
  content: string;
  createdAt: string;
}

@Injectable({ providedIn: 'root' })
export class CommentService {
  private readonly base = `${environment.apiUrl}/comments`;

  constructor(private http: HttpClient, private supabase: SupabaseService) {}

  private async authHeaders(): Promise<HttpHeaders> {
    const { data } = await this.supabase.client.auth.getSession();
    const token = data.session?.access_token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  async getByReview(reviewId: string): Promise<Comment[]> {
    try {
      return await firstValueFrom(
        this.http.get<Comment[]>(`${this.base}?reviewId=${reviewId}`)
      );
    } catch {
      return [];
    }
  }

  async add(reviewId: string, userId: string, userName: string, content: string): Promise<{ error?: string }> {
    try {
      const headers = await this.authHeaders();
      await firstValueFrom(
        this.http.post<Comment>(this.base, { reviewId, userId, userName, content }, { headers })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al publicar el comentario' };
    }
  }

  async delete(id: string, userId: string): Promise<{ error?: string }> {
    try {
      const headers = (await this.authHeaders()).set('X-User-Id', userId);
      await firstValueFrom(this.http.delete(`${this.base}/${id}`, { headers }));
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al eliminar el comentario' };
    }
  }
}

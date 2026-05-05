import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';

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

  constructor(private http: HttpClient) {}

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
      await firstValueFrom(
        this.http.post<Comment>(this.base, { reviewId, userId, userName, content })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al publicar el comentario' };
    }
  }

  async delete(id: string, userId: string): Promise<{ error?: string }> {
    try {
      const headers = new HttpHeaders({ 'X-User-Id': userId });
      await firstValueFrom(this.http.delete(`${this.base}/${id}`, { headers }));
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al eliminar el comentario' };
    }
  }
}

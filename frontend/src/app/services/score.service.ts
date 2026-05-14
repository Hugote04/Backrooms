import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { firstValueFrom } from 'rxjs';
import { environment } from '../../environments/environment';
import { SupabaseService } from './supabase.service';

export interface Score {
  id: string;
  userId: string;
  userName: string;
  nivel: string;
  tiempoSegundos: number;
  puzlesResueltos: number;
  createdAt: string;
}

export interface UserStats {
  totalPartidas: number;
  puzlesResueltos: number;
  mejorTiempo: number;
  partidas: Score[];
}

@Injectable({ providedIn: 'root' })
export class ScoreService {
  private readonly base = `${environment.apiUrl}/scores`;

  constructor(private http: HttpClient, private supabase: SupabaseService) {}

  private async authHeaders(): Promise<HttpHeaders> {
    const { data } = await this.supabase.client.auth.getSession();
    const token = data.session?.access_token;
    return token ? new HttpHeaders({ Authorization: `Bearer ${token}` }) : new HttpHeaders();
  }

  /** Leaderboard público — el backend devuelve { items: [...] } */
  async getLeaderboard(): Promise<Score[]> {
    try {
      const resp = await firstValueFrom(
        this.http.get<{ items: Score[] }>(`${this.base}/leaderboard`)
      );
      return resp?.items ?? [];
    } catch {
      return [];
    }
  }

  /** Stats del usuario — usa el endpoint público /user/{id} y calcula en cliente */
  async getMyStats(userId: string): Promise<UserStats | null> {
    try {
      const scores = await firstValueFrom(
        this.http.get<Score[]>(`${this.base}/user/${userId}`)
      );
      if (!scores || scores.length === 0)
        return { totalPartidas: 0, puzlesResueltos: 0, mejorTiempo: 0, partidas: [] };
      return {
        totalPartidas:   scores.length,
        puzlesResueltos: scores.reduce((s, r) => s + r.puzlesResueltos, 0),
        mejorTiempo:     Math.min(...scores.map(r => r.tiempoSegundos)),
        partidas:        scores,
      };
    } catch { return null; }
  }

  /** Obtener URL de avatar — lee de los metadatos de Supabase Auth */
  async getAvatarUrl(_userId: string): Promise<string | null> {
    try {
      const { data } = await this.supabase.client.auth.getUser();
      return (data.user?.user_metadata?.['avatarUrl'] as string) ?? null;
    } catch { return null; }
  }

  /** Subir avatar a Supabase Storage y guardar URL en user_metadata */
  async uploadAvatar(userId: string, file: File): Promise<{ url?: string; error?: string }> {
    try {
      const ext  = file.name.split('.').pop() ?? 'jpg';
      const path = `${userId}/avatar.${ext}`;

      const { error: uploadError } = await this.supabase.client.storage
        .from('avatars')
        .upload(path, file, { upsert: true, contentType: file.type });

      if (uploadError) return { error: uploadError.message };

      const { data } = this.supabase.client.storage.from('avatars').getPublicUrl(path);
      const avatarUrl = `${data.publicUrl}?t=${Date.now()}`;

      // Guardar URL en user_metadata — no requiere backend
      const { error: updateError } = await this.supabase.client.auth.updateUser({
        data: { avatarUrl },
      });
      if (updateError) return { error: updateError.message };

      return { url: avatarUrl };
    } catch (err: any) {
      return { error: err?.message ?? 'Error al subir el avatar' };
    }
  }

  /** Enviar puntuación desde Unity (o para pruebas) */
  async submit(userName: string, nivel: string, tiempoSegundos: number, puzlesResueltos: number): Promise<{ error?: string }> {
    try {
      const headers = await this.authHeaders();
      await firstValueFrom(
        this.http.post<Score>(this.base, { userName, nivel, tiempoSegundos, puzlesResueltos }, { headers })
      );
      return {};
    } catch (err: any) {
      return { error: err?.error?.error ?? 'Error al enviar la puntuación' };
    }
  }

  /** Formatea segundos como mm:ss */
  static formatTime(segundos: number): string {
    const m = Math.floor(segundos / 60).toString().padStart(2, '0');
    const s = (segundos % 60).toString().padStart(2, '0');
    return `${m}:${s}`;
  }
}

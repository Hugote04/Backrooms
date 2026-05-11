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

  /** Leaderboard público */
  async getLeaderboard(): Promise<Score[]> {
    try {
      return await firstValueFrom(this.http.get<Score[]>(`${this.base}/leaderboard`));
    } catch {
      return [];
    }
  }

  /** Stats del usuario logado */
  async getMyStats(): Promise<UserStats | null> {
    try {
      const headers = await this.authHeaders();
      return await firstValueFrom(this.http.get<UserStats>(`${this.base}/me`, { headers }));
    } catch {
      return null;
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

import { Injectable, signal } from '@angular/core';
import { SupabaseClient, User, Session } from '@supabase/supabase-js';
import { SupabaseService } from './supabase.service';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user    = signal<User | null>(null);
  session = signal<Session | null>(null);

  private readonly sb: SupabaseClient;

  constructor(supabaseService: SupabaseService) {
    this.sb = supabaseService.client;
    this.init();
  }

  private async init() {
    const { data } = await this.sb.auth.getSession();
    this.session.set(data.session);
    this.user.set(data.session?.user ?? null);

    this.sb.auth.onAuthStateChange((_, session) => {
      this.session.set(session);
      this.user.set(session?.user ?? null);
    });
  }

  async signUp(email: string, password: string, nombre?: string) {
    return this.sb.auth.signUp({
      email,
      password,
      options: {
        data: { nombre: nombre ?? email.split('@')[0] },
        emailRedirectTo: window.location.origin,
      },
    });
  }

  async signIn(email: string, password: string) {
    return this.sb.auth.signInWithPassword({ email, password });
  }

  async signOut() {
    return this.sb.auth.signOut();
  }

  async updateName(nombre: string) {
    const { error } = await this.sb.auth.updateUser({ data: { nombre } });
    if (!error) {
      const { data } = await this.sb.auth.getUser();
      if (data.user) this.user.set(data.user);
    }
    return { error };
  }

  async updatePassword(password: string) {
    return this.sb.auth.updateUser({ password });
  }

  async refreshUser() {
    const { data } = await this.sb.auth.getUser();
    if (data.user) this.user.set(data.user);
  }

  getDisplayName(): string {
    const user = this.user();
    if (!user) return '';
    return (user.user_metadata?.['nombre'] as string) ?? user.email?.split('@')[0] ?? 'Usuario';
  }
}

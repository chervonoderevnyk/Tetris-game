import { HttpClient } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3001/auth';

  constructor(private http: HttpClient) {}

  register(username: string, password: string): Observable<any> {
    return this.http.post(`${this.apiUrl}/register`, { username, password });
  }

  login(username: string, password: string): Observable<{ tokenA: string }> {
    return this.http.post<{ tokenA: string }>(`${this.apiUrl}/login`, { username, password });
  }

  saveToken(tokenA: string): void {
    localStorage.setItem('auth_tokenA', tokenA);
  }

  getToken(): string | null {
    return localStorage.getItem('auth_tokenA');
  }
}

import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Category, Question } from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';
import { parseAiQuestionResponse } from 'src/app/utils/question.utils';
import { environment } from 'src/environments/environment';

/**
 * Supported AI providers. Both expose an OpenAI-compatible
 * `/v1/chat/completions` endpoint, so only the base URL, the model name,
 * and the API key change between them.
 */
export type AiProvider = 'openai' | 'ollama';

interface ProviderConfig {
  baseUrl: string;
  defaultModel: string;
}

const PROVIDER_CONFIG: Record<AiProvider, ProviderConfig> = {
  openai: {
    baseUrl: environment.openApiUrl, // https://api.openai.com
    defaultModel: 'gpt-3.5-turbo',
  },
  ollama: {
    baseUrl: 'https://ollama.com',
    defaultModel: 'gpt-oss:120b',
  },
};

@Injectable({
  providedIn: 'root',
})
export class AiService {
  public hasToUseAi = new BehaviorSubject<boolean>(false);
  public hasToUseAi$ = this.hasToUseAi.asObservable();

  openAiToken: string | null = null;
  ollamaToken: string | null = null;
  aiProvider: AiProvider = 'openai';

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.loadAiProvider();
    this.loadOpenAiToken();
    this.loadOllamaToken();
    this.loadHasToUseAi();
  }

  saveHasToUseAi(value: boolean): void {
    this.localStorageService.set('hasToUseAi', value);
    this.hasToUseAi.next(value);
  }

  loadHasToUseAi(): void {
    const value = this.localStorageService.get<boolean>('hasToUseAi');
    this.hasToUseAi.next(value ?? false);
  }

  saveAiProvider(provider: AiProvider): void {
    this.aiProvider = provider;
    this.localStorageService.set('aiProvider', provider);
  }

  loadAiProvider(): void {
    const value = this.localStorageService.get<AiProvider>('aiProvider');
    this.aiProvider = value === 'ollama' ? 'ollama' : 'openai';
  }

  saveOpenAiToken(token: string): void {
    this.openAiToken = token;
    this.localStorageService.set('openAiToken', token);
  }

  loadOpenAiToken(): void {
    this.openAiToken = this.localStorageService.get<string>('openAiToken') || null;
  }

  saveOllamaToken(token: string): void {
    this.ollamaToken = token;
    this.localStorageService.set('ollamaToken', token);
  }

  loadOllamaToken(): void {
    this.ollamaToken = this.localStorageService.get<string>('ollamaToken') || null;
  }

  /** Token currently selected based on the active provider. */
  get activeToken(): string | null {
    return this.aiProvider === 'ollama' ? this.ollamaToken : this.openAiToken;
  }

  generateRandomQuestion(currentCategory: Category): Observable<Question | null> {
    // Refresh provider + token from storage in case settings changed
    this.loadAiProvider();
    this.loadOpenAiToken();
    this.loadOllamaToken();

    const config = PROVIDER_CONFIG[this.aiProvider];
    const token = this.activeToken;

    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${token}`,
    });

    const body = {
      model: config.defaultModel,
      messages: [
        {
          role: 'system',
          content:
            '"Genera una aleatoria e interesante pregunta basado en las reglas con la siguiente estructura:\n{\n      "id": "aabbcc111",\n      "question": "Cual es el nombre de la compania?",\n      "translationUS": "What is the name of the company?",\n      "category": "Category.challenges"\n }\n\nLas reglas son:\n- el atributo question tiene una pregunta para generar un tema de conversacion y conversar con "la familia" sobre "' +
            currentCategory +
            '"\n- el id es un string aleatoreo alfanumerico\n- el atributo category es igual a Category.relationships, sin comillas\n- el atributo translationUS es igual a la traduccion al ingles de la pregunta que esta en el atributo question"',
        },
      ],
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    return this.http
      .post<{ choices: { message: { content: string } }[] }>(
        `${config.baseUrl}/v1/chat/completions`,
        body,
        { headers }
      )
      .pipe(
        map((response) => response.choices[0].message.content),
        map((text: string) => parseAiQuestionResponse(text))
      );
  }
}

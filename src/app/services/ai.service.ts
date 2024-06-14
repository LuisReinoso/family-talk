import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, map, Observable } from 'rxjs';
import { Category } from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  public hasToUseAi = new BehaviorSubject<boolean>(false);
  public hasToUseAi$ = this.hasToUseAi.asObservable();

  private apiUrl = 'https://api.openai.com';
  openAiToken!: string | null;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.loadOpenAiToken();
    this.loadHasToUseAi();
  }

  saveHasToUseAi(value: boolean): void {
    this.localStorageService.set('hasToUseAi', value);
    this.hasToUseAi.next(value);
  }

  loadHasToUseAi(): void {
    this.hasToUseAi.next(this.localStorageService.get('hasToUseAi'));
  }

  generateRandomQuestion(currentCategory: Category): Observable<any> {
    this.loadOpenAiToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.openAiToken}`,
    });

    const body = {
      model: 'gpt-3.5-turbo',
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
      .post(`${this.apiUrl}/v1/chat/completions`, body, { headers })
      .pipe(
        map((response: any) => {
          return response.choices[0].message.content;
        }),
        map((text) => {
          let question = null;

          try {
            question = JSON.parse(text);
          } catch (error) {
            question = null;
          }

          return question;
        })
      );
  }

  saveOpenAiToken(openAiToken: any) {
    this.openAiToken = openAiToken;
    this.localStorageService.set('openAiToken', openAiToken);
  }

  loadOpenAiToken() {
    this.openAiToken = this.localStorageService.get('openAiToken') || null;
  }
}

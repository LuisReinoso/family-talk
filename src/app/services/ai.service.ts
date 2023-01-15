import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { map, Observable } from 'rxjs';
import { Category } from 'src/app/models/questions';
import { LocalStorageService } from 'src/app/services/local-storage.service';

@Injectable({
  providedIn: 'root',
})
export class AiService {
  private apiUrl = 'https://api.openai.com';
  openAiToken!: string;

  constructor(
    private http: HttpClient,
    private localStorageService: LocalStorageService
  ) {
    this.loadOpenAiToken();
  }

  generateRandomQuestion(currentCategory: Category): Observable<any> {
    this.loadOpenAiToken();
    const headers = new HttpHeaders({
      'Content-Type': 'application/json',
      Authorization: `Bearer ${this.openAiToken}`,
    });

    const body = {
      prompt:
        '"Con la siguiente estructura:\n{\n      "id": "aabbcc111",\n      "question": "Cual es el nombre de la compania?",\n      "translationUS": "What is the name of the company?",\n      "category": "Category.challenges"\n }\n\nLas reglas son:\n- el atributo question agrega una pregunta para conversar con "la familia" sobre "' +
        currentCategory +
        '"\n- el id es un string aleatoreo alfanumerico\n- el atributo category es igual a Category.relationships, sin comillas\n- el atributo translationUS es igual a la traduccion al ingles de la pregunta que esta en el atributo question"',
      model: 'text-davinci-003',
      temperature: 1,
      max_tokens: 256,
      top_p: 1,
      frequency_penalty: 0,
      presence_penalty: 0,
    };

    return this.http
      .post(`${this.apiUrl}/v1/completions`, body, { headers })
      .pipe(
        map((response: any) => {
          return response.choices[0].text;
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
    this.localStorageService.save('openAiToken', openAiToken);
  }

  loadOpenAiToken() {
    this.openAiToken = this.localStorageService.get('openAiToken') || null;
  }
}

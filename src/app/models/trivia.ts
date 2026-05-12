/**
 * Trivia game model — completely separate from the conversational
 * Question model. Trivia questions have a correct answer plus 3 plausible
 * distractors. Game loop, scoring and UI are all distinct from the
 * conversation mode.
 */

export enum TriviaCategory {
  random = 'Todas',
  countries = 'Países',
  cities = 'Ciudades',
  music = 'Música',
  fruits = 'Frutas',
  football = 'Fútbol',
  colors = 'Colores',
}

export interface TriviaQuestion {
  id: string;
  question: string;
  translationUS: string;
  category: TriviaCategory;
  /** Correct answer (Spanish). MUST also be present in `options`. */
  answer: string;
  /** Correct answer (English). MUST also be present in `optionsUS`. */
  answerUS: string;
  /** 4 options including the correct one (Spanish). Order is randomized at render time. */
  options: string[];
  /** 4 options including the correct one (English). */
  optionsUS: string[];
}

export interface TriviaCategoryMeta {
  id: TriviaCategory;
  emoji: string;
  /** Image path (placeholder shared with random for now). */
  image: string;
}

export const triviaCategoryMeta: Record<TriviaCategory, TriviaCategoryMeta> = {
  [TriviaCategory.random]: { id: TriviaCategory.random, emoji: '🎲', image: '/assets/categories/triviaRandom.png' },
  [TriviaCategory.countries]: { id: TriviaCategory.countries, emoji: '🌎', image: '/assets/categories/triviaCountries.png' },
  [TriviaCategory.cities]: { id: TriviaCategory.cities, emoji: '🏙️', image: '/assets/categories/triviaCities.png' },
  [TriviaCategory.music]: { id: TriviaCategory.music, emoji: '🎵', image: '/assets/categories/triviaMusic.png' },
  [TriviaCategory.fruits]: { id: TriviaCategory.fruits, emoji: '🍎', image: '/assets/categories/triviaFruits.png' },
  [TriviaCategory.football]: { id: TriviaCategory.football, emoji: '⚽', image: '/assets/categories/triviaFootball.png' },
  [TriviaCategory.colors]: { id: TriviaCategory.colors, emoji: '🎨', image: '/assets/categories/triviaColors.png' },
};

const t = (
  id: string,
  category: TriviaCategory,
  q: string,
  qEn: string,
  answer: string,
  answerUS: string,
  wrong: [string, string, string],
  wrongUS: [string, string, string],
): TriviaQuestion => ({
  id,
  question: q,
  translationUS: qEn,
  category,
  answer,
  answerUS,
  options: [answer, ...wrong],
  optionsUS: [answerUS, ...wrongUS],
});

export const triviaQuestions: TriviaQuestion[] = [
  // ── Países ───────────────────────────────────────────────────────
  t('tq_country_01', TriviaCategory.countries, '¿Cuál es la capital de Australia?', 'What is the capital of Australia?', 'Canberra', 'Canberra', ['Sídney', 'Melbourne', 'Perth'], ['Sydney', 'Melbourne', 'Perth']),
  t('tq_country_02', TriviaCategory.countries, '¿En qué continente está Egipto?', 'What continent is Egypt in?', 'África', 'Africa', ['Asia', 'Europa', 'Oceanía'], ['Asia', 'Europe', 'Oceania']),
  t('tq_country_03', TriviaCategory.countries, '¿Cuál es el país más grande del mundo en territorio?', "What is the world's largest country by area?", 'Rusia', 'Russia', ['Canadá', 'China', 'Estados Unidos'], ['Canada', 'China', 'United States']),
  t('tq_country_04', TriviaCategory.countries, '¿Qué país tiene forma de bota?', 'Which country is shaped like a boot?', 'Italia', 'Italy', ['Grecia', 'España', 'Portugal'], ['Greece', 'Spain', 'Portugal']),
  t('tq_country_05', TriviaCategory.countries, '¿Cuál es la capital de Japón?', 'What is the capital of Japan?', 'Tokio', 'Tokyo', ['Kioto', 'Osaka', 'Seúl'], ['Kyoto', 'Osaka', 'Seoul']),
  t('tq_country_06', TriviaCategory.countries, '¿En qué país está la Torre Eiffel?', 'In which country is the Eiffel Tower?', 'Francia', 'France', ['Italia', 'Inglaterra', 'Alemania'], ['Italy', 'England', 'Germany']),
  t('tq_country_07', TriviaCategory.countries, '¿Qué idioma se habla oficialmente en Brasil?', "What's the official language of Brazil?", 'Portugués', 'Portuguese', ['Español', 'Inglés', 'Italiano'], ['Spanish', 'English', 'Italian']),
  t('tq_country_08', TriviaCategory.countries, '¿Cuál es la capital de Argentina?', 'What is the capital of Argentina?', 'Buenos Aires', 'Buenos Aires', ['Córdoba', 'Rosario', 'Mendoza'], ['Córdoba', 'Rosario', 'Mendoza']),
  t('tq_country_09', TriviaCategory.countries, '¿Qué océano separa América de Europa?', 'Which ocean separates America from Europe?', 'Atlántico', 'Atlantic', ['Pacífico', 'Índico', 'Ártico'], ['Pacific', 'Indian', 'Arctic']),
  t('tq_country_10', TriviaCategory.countries, '¿Cuál es el país más pequeño del mundo?', "What is the world's smallest country?", 'Vaticano', 'Vatican City', ['Mónaco', 'San Marino', 'Liechtenstein'], ['Monaco', 'San Marino', 'Liechtenstein']),

  // ── Ciudades ─────────────────────────────────────────────────────
  t('tq_city_01', TriviaCategory.cities, '¿En qué ciudad está la Estatua de la Libertad?', 'In which city is the Statue of Liberty?', 'Nueva York', 'New York', ['Washington D.C.', 'Boston', 'Chicago'], ['Washington D.C.', 'Boston', 'Chicago']),
  t('tq_city_02', TriviaCategory.cities, '¿En qué ciudad está el Coliseo Romano?', 'In which city is the Roman Colosseum?', 'Roma', 'Rome', ['Atenas', 'Florencia', 'Nápoles'], ['Athens', 'Florence', 'Naples']),
  t('tq_city_03', TriviaCategory.cities, '¿Cuál es la capital de España?', 'What is the capital of Spain?', 'Madrid', 'Madrid', ['Barcelona', 'Sevilla', 'Valencia'], ['Barcelona', 'Seville', 'Valencia']),
  t('tq_city_04', TriviaCategory.cities, '¿En qué ciudad está la Sagrada Familia?', 'In which city is the Sagrada Familia?', 'Barcelona', 'Barcelona', ['Madrid', 'Bilbao', 'Sevilla'], ['Madrid', 'Bilbao', 'Seville']),
  t('tq_city_05', TriviaCategory.cities, '¿Cuál es la capital de México?', 'What is the capital of Mexico?', 'Ciudad de México', 'Mexico City', ['Guadalajara', 'Monterrey', 'Cancún'], ['Guadalajara', 'Monterrey', 'Cancún']),
  t('tq_city_06', TriviaCategory.cities, '¿En qué ciudad nacieron los Beatles?', 'In which city were the Beatles born?', 'Liverpool', 'Liverpool', ['Londres', 'Mánchester', 'Birmingham'], ['London', 'Manchester', 'Birmingham']),
  t('tq_city_07', TriviaCategory.cities, '¿Cuál es la capital de Colombia?', 'What is the capital of Colombia?', 'Bogotá', 'Bogotá', ['Medellín', 'Cali', 'Cartagena'], ['Medellín', 'Cali', 'Cartagena']),
  t('tq_city_08', TriviaCategory.cities, '¿En qué ciudad está la Torre de Pisa?', 'In which city is the Leaning Tower?', 'Pisa', 'Pisa', ['Roma', 'Florencia', 'Milán'], ['Rome', 'Florence', 'Milan']),
  t('tq_city_09', TriviaCategory.cities, '¿Cuál es la capital de Ecuador?', 'What is the capital of Ecuador?', 'Quito', 'Quito', ['Guayaquil', 'Cuenca', 'Manta'], ['Guayaquil', 'Cuenca', 'Manta']),
  t('tq_city_10', TriviaCategory.cities, '¿En qué ciudad está el Cristo Redentor?', 'In which city is the Christ the Redeemer statue?', 'Río de Janeiro', 'Rio de Janeiro', ['São Paulo', 'Buenos Aires', 'Lima'], ['São Paulo', 'Buenos Aires', 'Lima']),

  // ── Música ───────────────────────────────────────────────────────
  t('tq_music_01', TriviaCategory.music, '¿Quién compuso "Las cuatro estaciones"?', 'Who composed "The Four Seasons"?', 'Antonio Vivaldi', 'Antonio Vivaldi', ['Mozart', 'Bach', 'Chopin'], ['Mozart', 'Bach', 'Chopin']),
  t('tq_music_02', TriviaCategory.music, '¿De qué banda era John Lennon?', 'Which band was John Lennon part of?', 'The Beatles', 'The Beatles', ['The Rolling Stones', 'Queen', 'Pink Floyd'], ['The Rolling Stones', 'Queen', 'Pink Floyd']),
  t('tq_music_03', TriviaCategory.music, '¿Cuántas cuerdas tiene una guitarra estándar?', 'How many strings does a standard guitar have?', '6', '6', ['4', '5', '7'], ['4', '5', '7']),
  t('tq_music_04', TriviaCategory.music, '¿Quién canta "Despacito"?', 'Who sings "Despacito"?', 'Luis Fonsi', 'Luis Fonsi', ['Daddy Yankee', 'Maluma', 'Shakira'], ['Daddy Yankee', 'Maluma', 'Shakira']),
  t('tq_music_05', TriviaCategory.music, '¿Quién compuso la Novena Sinfonía?', 'Who composed the Ninth Symphony?', 'Beethoven', 'Beethoven', ['Mozart', 'Bach', 'Brahms'], ['Mozart', 'Bach', 'Brahms']),
  t('tq_music_06', TriviaCategory.music, '¿Quién es la "Reina del Pop"?', 'Who is the "Queen of Pop"?', 'Madonna', 'Madonna', ['Britney Spears', 'Beyoncé', 'Lady Gaga'], ['Britney Spears', 'Beyoncé', 'Lady Gaga']),
  t('tq_music_07', TriviaCategory.music, '¿Cuántas notas musicales hay en la escala básica?', 'How many notes are there in the basic musical scale?', '7', '7', ['5', '8', '12'], ['5', '8', '12']),
  t('tq_music_08', TriviaCategory.music, '¿Qué género musical hizo famoso a Bad Bunny?', 'What genre made Bad Bunny famous?', 'Reggaetón', 'Reggaeton', ['Pop', 'Rock', 'Salsa'], ['Pop', 'Rock', 'Salsa']),
  t('tq_music_09', TriviaCategory.music, '¿Qué instrumento toca un pianista?', 'What instrument does a pianist play?', 'Piano', 'Piano', ['Violín', 'Guitarra', 'Saxofón'], ['Violin', 'Guitar', 'Saxophone']),
  t('tq_music_10', TriviaCategory.music, '¿Quién es el "Rey del Pop"?', 'Who is the "King of Pop"?', 'Michael Jackson', 'Michael Jackson', ['Prince', 'Elvis Presley', 'Justin Bieber'], ['Prince', 'Elvis Presley', 'Justin Bieber']),

  // ── Frutas ───────────────────────────────────────────────────────
  t('tq_fruit_01', TriviaCategory.fruits, '¿Qué fruta es famosa por su vitamina C?', 'Which fruit is famous for its vitamin C?', 'Naranja', 'Orange', ['Manzana', 'Banana', 'Uva'], ['Apple', 'Banana', 'Grape']),
  t('tq_fruit_02', TriviaCategory.fruits, '¿Qué fruta amarilla y curvada comen los monos?', 'What yellow curved fruit do monkeys eat?', 'Plátano', 'Banana', ['Limón', 'Pera', 'Mango'], ['Lemon', 'Pear', 'Mango']),
  t('tq_fruit_03', TriviaCategory.fruits, '¿Qué fruta tiene sus semillas por fuera?', 'Which fruit has its seeds on the outside?', 'Fresa', 'Strawberry', ['Frambuesa', 'Granada', 'Kiwi'], ['Raspberry', 'Pomegranate', 'Kiwi']),
  t('tq_fruit_04', TriviaCategory.fruits, '¿Qué fruta es verde por fuera y roja por dentro?', 'Which fruit is green outside and red inside?', 'Sandía', 'Watermelon', ['Melón', 'Manzana', 'Kiwi'], ['Melon', 'Apple', 'Kiwi']),
  t('tq_fruit_05', TriviaCategory.fruits, '¿Con qué fruta se hace el vino?', 'What fruit is wine made from?', 'Uva', 'Grape', ['Manzana', 'Cereza', 'Mora'], ['Apple', 'Cherry', 'Blackberry']),
  t('tq_fruit_06', TriviaCategory.fruits, '¿Qué fruta está cubierta de pelos finos?', 'Which fruit is covered in fuzzy hair?', 'Kiwi', 'Kiwi', ['Coco', 'Maracuyá', 'Dátil'], ['Coconut', 'Passion fruit', 'Date']),
  t('tq_fruit_07', TriviaCategory.fruits, '¿Qué fruta tropical tiene una corona de hojas?', 'Which tropical fruit has a crown of leaves on top?', 'Piña', 'Pineapple', ['Mango', 'Papaya', 'Coco'], ['Mango', 'Papaya', 'Coconut']),
  t('tq_fruit_08', TriviaCategory.fruits, '¿Qué fruta roja con tallo verde tiene un solo hueso?', 'Which red fruit with a green stem has one pit?', 'Cereza', 'Cherry', ['Fresa', 'Manzana', 'Ciruela'], ['Strawberry', 'Apple', 'Plum']),
  t('tq_fruit_09', TriviaCategory.fruits, '¿Qué fruta morada se usa para hacer mermelada?', 'Which purple fruit is often made into jam?', 'Mora', 'Blackberry', ['Uva', 'Arándano', 'Frambuesa'], ['Grape', 'Blueberry', 'Raspberry']),
  t('tq_fruit_10', TriviaCategory.fruits, '¿Qué fruta amarilla y ácida se exprime para limonada?', 'Which sour yellow fruit is squeezed for lemonade?', 'Limón', 'Lemon', ['Naranja', 'Toronja', 'Mandarina'], ['Orange', 'Grapefruit', 'Tangerine']),

  // ── Fútbol ───────────────────────────────────────────────────────
  t('tq_football_01', TriviaCategory.football, '¿Cuántos jugadores tiene un equipo de fútbol en la cancha?', 'How many players does a soccer team have on the field?', '11', '11', ['10', '9', '12'], ['10', '9', '12']),
  t('tq_football_02', TriviaCategory.football, '¿Qué país ganó el Mundial 2022?', 'Which country won the 2022 World Cup?', 'Argentina', 'Argentina', ['Francia', 'Brasil', 'Alemania'], ['France', 'Brazil', 'Germany']),
  t('tq_football_03', TriviaCategory.football, '¿De qué país es Lionel Messi?', 'What country is Lionel Messi from?', 'Argentina', 'Argentina', ['Brasil', 'Uruguay', 'España'], ['Brazil', 'Uruguay', 'Spain']),
  t('tq_football_04', TriviaCategory.football, '¿Cuántos minutos dura un partido estándar?', 'How many minutes does a standard match last?', '90', '90', ['60', '80', '120'], ['60', '80', '120']),
  t('tq_football_05', TriviaCategory.football, '¿En qué país nació el fútbol moderno?', 'In which country was modern soccer born?', 'Inglaterra', 'England', ['Brasil', 'Italia', 'Alemania'], ['Brazil', 'Italy', 'Germany']),
  t('tq_football_06', TriviaCategory.football, '¿De qué país es Cristiano Ronaldo?', 'What country is Cristiano Ronaldo from?', 'Portugal', 'Portugal', ['España', 'Brasil', 'Italia'], ['Spain', 'Brazil', 'Italy']),
  t('tq_football_07', TriviaCategory.football, '¿De qué color es la tarjeta que expulsa?', 'What color is the card that sends a player off?', 'Roja', 'Red', ['Amarilla', 'Verde', 'Azul'], ['Yellow', 'Green', 'Blue']),
  t('tq_football_08', TriviaCategory.football, '¿Cada cuántos años se juega el Mundial?', 'How often is the World Cup held?', 'Cada 4 años', 'Every 4 years', ['Cada 2 años', 'Cada 3 años', 'Cada 5 años'], ['Every 2 years', 'Every 3 years', 'Every 5 years']),
  t('tq_football_09', TriviaCategory.football, '¿Cuántos puntos suma una victoria en liga?', 'How many points does a win count in a league?', '3', '3', ['1', '2', '5'], ['1', '2', '5']),
  t('tq_football_10', TriviaCategory.football, '¿Qué jugador es apodado "La Pulga"?', 'Which player is nicknamed "The Flea"?', 'Lionel Messi', 'Lionel Messi', ['Cristiano Ronaldo', 'Neymar', 'Mbappé'], ['Cristiano Ronaldo', 'Neymar', 'Mbappé']),

  // ── Colores ──────────────────────────────────────────────────────
  t('tq_color_01', TriviaCategory.colors, '¿Qué color resulta de mezclar amarillo y azul?', 'What color do you get mixing yellow and blue?', 'Verde', 'Green', ['Naranja', 'Morado', 'Café'], ['Orange', 'Purple', 'Brown']),
  t('tq_color_02', TriviaCategory.colors, '¿De qué color es el cielo en un día despejado?', 'What color is the sky on a clear day?', 'Azul', 'Blue', ['Blanco', 'Gris', 'Verde'], ['White', 'Gray', 'Green']),
  t('tq_color_03', TriviaCategory.colors, '¿Qué dos colores forman el púrpura?', 'Which two colors make purple?', 'Rojo y azul', 'Red and blue', ['Rojo y amarillo', 'Azul y verde', 'Amarillo y azul'], ['Red and yellow', 'Blue and green', 'Yellow and blue']),
  t('tq_color_04', TriviaCategory.colors, '¿Cuántos colores tiene el arcoíris?', 'How many colors does the rainbow have?', '7', '7', ['5', '6', '8'], ['5', '6', '8']),
  t('tq_color_05', TriviaCategory.colors, '¿Qué color se obtiene mezclando rojo y amarillo?', 'What color do you get mixing red and yellow?', 'Naranja', 'Orange', ['Verde', 'Morado', 'Café'], ['Green', 'Purple', 'Brown']),
  t('tq_color_06', TriviaCategory.colors, '¿Cuáles son los tres colores primarios?', 'What are the three primary colors?', 'Rojo, azul y amarillo', 'Red, blue and yellow', ['Verde, morado y naranja', 'Negro, blanco y gris', 'Rojo, verde y azul'], ['Green, purple and orange', 'Black, white and gray', 'Red, green and blue']),
  t('tq_color_07', TriviaCategory.colors, '¿Qué color es complementario del rojo?', 'What color is complementary to red?', 'Verde', 'Green', ['Azul', 'Amarillo', 'Morado'], ['Blue', 'Yellow', 'Purple']),
  t('tq_color_08', TriviaCategory.colors, '¿De qué color es la nieve?', 'What color is snow?', 'Blanco', 'White', ['Azul', 'Gris', 'Plateado'], ['Blue', 'Gray', 'Silver']),
  t('tq_color_09', TriviaCategory.colors, '¿Qué color tiene el sol en los dibujos infantiles?', "What color is the sun in children's drawings?", 'Amarillo', 'Yellow', ['Naranja', 'Rojo', 'Blanco'], ['Orange', 'Red', 'White']),
  t('tq_color_10', TriviaCategory.colors, '¿De qué color es el césped sano?', 'What color is healthy grass?', 'Verde', 'Green', ['Amarillo', 'Café', 'Azul'], ['Yellow', 'Brown', 'Blue']),
];

/**
 * Filter trivia questions by category. `TriviaCategory.random` returns all.
 */
export function filterTrivia(
  questions: TriviaQuestion[],
  category: TriviaCategory,
): TriviaQuestion[] {
  if (category === TriviaCategory.random) return questions;
  return questions.filter((q) => q.category === category);
}

/**
 * Shuffle an array (Fisher-Yates). Returns a new array.
 */
export function shuffle<T>(arr: T[]): T[] {
  const out = [...arr];
  for (let i = out.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [out[i], out[j]] = [out[j], out[i]];
  }
  return out;
}

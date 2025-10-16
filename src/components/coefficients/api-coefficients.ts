import { req_json } from '../../api'

/**
 * Интерфейс для элемента коэффициента
 * Используется для унификации структуры данных во всех компонентах
 */
export interface CoefficientItem {
  value: string // ID коэффициента (например, "1", "2", "3")
  label: string // Отображаемое название (например, "Ra 0.8", "Ra 1.6")
}

/**
 * Интерфейс для всех типов коэффициентов
 * Содержит массивы для каждого типа: шероховатость, покрытие, допуски
 */
export interface CoefficientsData {
  finish: CoefficientItem[] // Шероховатость поверхности (Ra)
  cover: CoefficientItem[] // Типы покрытий
  tolerance: CoefficientItem[] // Квалитеты точности
}

// Кеш для хранения загруженных данных
// null означает, что данные еще не загружены
let coefficientsCache: CoefficientsData | null = null

// Промис текущего запроса для предотвращения дублирующих запросов
// null означает, что запрос не выполняется
let coefficientsPromise: Promise<CoefficientsData> | null = null

/**
 * Получает коэффициенты с сервера с использованием кеширования
 * Реализует паттерн синглтон для предотвращения множественных запросов
 *
 * @returns Promise<CoefficientsData> - данные всех коэффициентов
 */
export async function getCoefficients(): Promise<CoefficientsData> {
  // Если данные уже закешированы, возвращаем их немедленно
  // Это самый быстрый путь - без сетевых запросов
  if (coefficientsCache) {
    return coefficientsCache
  }

  // Если запрос уже выполняется, возвращаем тот же промис
  // Это предотвращает создание дублирующих запросов при одновременном
  // монтировании нескольких компонентов
  if (coefficientsPromise) {
    return coefficientsPromise
  }

  // Создаем новый промис для API запроса
  // Используем IIFE (Immediately Invoked Function Expression) для
  // создания асинхронной функции, которая выполняется сразу
  coefficientsPromise = (async () => {
    try {
      // Выполняем единственный API запрос к серверу
      const r = await req_json(`/coefficients/`, 'GET')
      const data = await r?.json()

      // Трансформируем данные сервера в унифицированный формат
      // Сервер возвращает объекты с полями id и value
      // Мы преобразуем их в объекты с полями value и label
      coefficientsCache = {
        // Шероховатость поверхности - массив вариантов Ra
        finish: data.finish.map((item: any) => ({
          value: item.id, // ID для отправки на сервер
          label: item.label, // Название для отображения пользователю
        })),

        // Типы покрытий - массив вариантов покрытий
        cover: data.cover.map((item: any) => ({
          value: item.id, // ID для отправки на сервер
          label: item.label, // Название для отображения пользователю
        })),

        // Квалитеты точности - массив вариантов допусков
        tolerance: data.tolerance.map((item: any) => ({
          value: item.id, // ID для отправки на сервер
          label: item.label, // Название для отображения пользователю
        })),
      }

      // Возвращаем закешированные данные
      return coefficientsCache
    } catch (error) {
      // Логируем ошибку для отладки
      console.error('Failed to load coefficients:', error)

      // Очищаем промис при ошибке, чтобы можно было повторить запрос
      // Без этого при ошибке все последующие вызовы будут получать
      // отклоненный промис вместо попытки нового запроса
      coefficientsPromise = null

      // Пробрасываем ошибку дальше для обработки в компонентах
      throw error
    }
  })()

  // Возвращаем промис (либо новый, либо существующий)
  return coefficientsPromise
}

/**
 * Очищает кеш коэффициентов
 * Полезно для принудительного обновления данных или при смене пользователя
 *
 * Использование:
 * - При логауте пользователя
 * - При необходимости обновить данные
 * - При изменении конфигурации сервера
 */
export function clearCoefficientsCache() {
  // Очищаем кеш данных
  coefficientsCache = null

  // Очищаем промис, чтобы следующий вызов создал новый запрос
  coefficientsPromise = null
}

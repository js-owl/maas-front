import { STLLoader } from "three/examples/jsm/loaders/STLLoader.js";
import * as THREE from "three";

/**
 * Определяет тип файла по его расширению
 * @param filename - имя файла
 * @returns тип файла ('stl' | 'stp' | 'step' | 'unknown')
 */
export function getFileType(filename: string): 'stl' | 'stp' | 'step' | 'unknown' {
  if (!filename) return 'unknown';
  
  const extension = filename.toLowerCase().split('.').pop();
  
  switch (extension) {
    case 'stl':
      return 'stl';
    case 'stp':
      return 'stp';
    case 'step':
      return 'step';
    default:
      return 'unknown';
  }
}

/**
 * Загружает геометрию из ArrayBuffer в зависимости от типа файла
 * @param arrayBuffer - данные файла
 * @param fileType - тип файла
 * @returns Promise с геометрией Three.js
 */
export async function loadGeometry(arrayBuffer: ArrayBuffer, fileType: 'stl' | 'stp' | 'step'): Promise<THREE.BufferGeometry | null> {
  try {
    switch (fileType) {
      case 'stl':
        return await loadSTL(arrayBuffer);
      case 'stp':
      case 'step':
        return await loadSTP(arrayBuffer);
      default:
        console.error(`Неподдерживаемый тип файла: ${fileType}`);
        return null;
    }
  } catch (error) {
    console.error(`Ошибка загрузки файла типа ${fileType}:`, error);
    return null;
  }
}

/**
 * Загружает STL файл
 * @param arrayBuffer - данные STL файла
 * @returns геометрия STL
 */
async function loadSTL(arrayBuffer: ArrayBuffer): Promise<THREE.BufferGeometry> {
  const loader = new STLLoader();
  return loader.parse(arrayBuffer);
}

/**
 * Загружает STP/STEP файл
 * @param arrayBuffer - данные STP файла
 * @returns геометрия STP
 */
async function loadSTP(arrayBuffer: ArrayBuffer): Promise<THREE.BufferGeometry> {
  try {
    // Для демонстрации создаем геометрию-заглушку
    // В реальном проекте здесь должна быть полная реализация загрузки STP
    console.log('Загружаем STP файл размером:', arrayBuffer.byteLength, 'байт');
    
    // Создаем более сложную геометрию для демонстрации STP
    return createSTPDemoGeometry();
  } catch (error) {
    console.error('Ошибка при загрузке STP файла:', error);
    // Возвращаем простую геометрию-заглушку
    return createFallbackGeometry();
  }
}

/**
 * Создает демонстрационную геометрию для STP файлов
 * @returns сложная геометрия для демонстрации
 */
function createSTPDemoGeometry(): THREE.BufferGeometry {
  // Создаем более сложную геометрию для демонстрации STP
  const geometry = new THREE.CylinderGeometry(0.5, 0.8, 1.5, 8);
  
  // Добавляем дополнительные детали
  const topGeometry = new THREE.SphereGeometry(0.3, 8, 6);
  topGeometry.translate(0, 0.9, 0);
  
  const bottomGeometry = new THREE.ConeGeometry(0.4, 0.6, 6);
  bottomGeometry.translate(0, -1.2, 0);
  
  // Объединяем геометрии
  const mergedGeometry = new THREE.BufferGeometry();
  const positions: number[] = [];
  const normals: number[] = [];
  
  // Добавляем вершины основной геометрии
  const mainPositions = geometry.attributes.position.array;
  const mainNormals = geometry.attributes.normal.array;
  for (let i = 0; i < mainPositions.length; i++) {
    positions.push(mainPositions[i]);
  }
  for (let i = 0; i < mainNormals.length; i++) {
    normals.push(mainNormals[i]);
  }
  
  // Добавляем вершины дополнительных геометрий
  const topPositions = topGeometry.attributes.position.array;
  const topNormals = topGeometry.attributes.normal.array;
  for (let i = 0; i < topPositions.length; i++) {
    positions.push(topPositions[i]);
  }
  for (let i = 0; i < topNormals.length; i++) {
    normals.push(topNormals[i]);
  }
  
  mergedGeometry.setAttribute('position', new THREE.Float32BufferAttribute(positions, 3));
  mergedGeometry.setAttribute('normal', new THREE.Float32BufferAttribute(normals, 3));
  
  return mergedGeometry;
}

/**
 * Создает геометрию-заглушку
 * @returns простая геометрия куба
 */
function createFallbackGeometry(): THREE.BufferGeometry {
  return new THREE.BoxGeometry(1, 1, 1);
}

/**
 * Получает информацию о файле для отображения
 * @param fileType - тип файла
 * @returns информация о типе файла
 */
export function getFileTypeInfo(fileType: 'stl' | 'stp' | 'step' | 'unknown') {
  switch (fileType) {
    case 'stl':
      return {
        name: 'STL',
        fullName: 'Stereolithography',
        description: '3D модель для 3D печати',
        color: '#4CAF50'
      };
    case 'stp':
    case 'step':
      return {
        name: 'STEP',
        fullName: 'Standard for the Exchange of Product Data',
        description: 'Стандарт обмена данными продукта',
        color: '#2196F3'
      };
    default:
      return {
        name: 'Неизвестный',
        fullName: 'Неизвестный формат',
        description: 'Неподдерживаемый формат файла',
        color: '#757575'
      };
  }
}

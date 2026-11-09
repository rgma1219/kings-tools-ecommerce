import 'dotenv/config';
import { initializeApp } from 'firebase/app';
import {
  collection,
  doc,
  getFirestore,
  serverTimestamp,
  setDoc,
} from 'firebase/firestore';
import type { CategoryId } from '../src/types/product.types';

const firebaseConfig = {
  apiKey: process.env.VITE_FIREBASE_API_KEY,
  authDomain: process.env.VITE_FIREBASE_AUTH_DOMAIN,
  projectId: process.env.VITE_FIREBASE_PROJECT_ID,
  storageBucket: process.env.VITE_FIREBASE_STORAGE_BUCKET,
  messagingSenderId: process.env.VITE_FIREBASE_MESSAGING_SENDER_ID,
  appId: process.env.VITE_FIREBASE_APP_ID,
};

if (!firebaseConfig.projectId) {
  console.error(
    'Error: Faltan las variables VITE_FIREBASE_* en el archivo .env'
  );
  process.exit(1);
}

const app = initializeApp(firebaseConfig);
const db = getFirestore(app);

const PLACEHOLDER_IMAGE = '/images/product-placeholder.svg';

interface SeedItem {
  name: string;
  description: string;
  price: number;
  stock: number;
  categoryId: CategoryId;
}

const CATALOG_SEED: SeedItem[] = [
  // 1. Herramientas Eléctricas (10)
  {
    name: 'Taladro Percutor Inalámbrico 20V Brushless',
    description:
      'Taladro percutor de 13mm con motor sin escobillas, 2 baterías de litio 2.0Ah y maletín de transporte.',
    price: 185000,
    stock: 15,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Amoladora Angular 115mm 900W Industrial',
    description:
      'Amoladora compacta de 4-1/2 pulgadas con arranque suave, bloqueo de eje y empuñadura antivibración.',
    price: 92000,
    stock: 22,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Sierra Circular 7-1/4" 1600W con Guía Láser',
    description:
      'Sierra circular para madera con base de aluminio inclinable a 45 grados y disco de carburo de 24 dientes.',
    price: 164000,
    stock: 10,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Rotomartillo SDS Plus 800W 2.7 Joules',
    description:
      'Rotomartillo electroneumático con 3 modos de operación: perforación, rotopercusión y cincelado.',
    price: 198000,
    stock: 8,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Lijadora Roto Orbital 125mm 300W Velocidad Variable',
    description:
      'Lijadora con base con abrojo, recolector de polvo microfiltrante y regulador electrónico de 6 velocidades.',
    price: 78500,
    stock: 18,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Sierra Caladora Pendular 650W Cambio Rápido',
    description:
      'Caladora con movimiento pendular de 4 posiciones, soplador de viruta y encastre rápido sin llave.',
    price: 89000,
    stock: 14,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Atornillador de Impacto 20V 180Nm Hexagonal 1/4"',
    description:
      'Atornillador de alto torque para montaje estructural y carpintería pesada con luz LED triple.',
    price: 152000,
    stock: 12,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Pistola de Calor 2000W Doble Temperatura',
    description:
      'Decapador térmico con ajuste de 350°C y 550°C para remoción de pintura, termocontraíbles y moldeado.',
    price: 54000,
    stock: 25,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Soldadora Inverter MMA 200A Bivoltaje Digital',
    description:
      'Soldadora compacta IGBT con display digital, función Anti-Stick, Hot Start y correa de hombro.',
    price: 215000,
    stock: 9,
    categoryId: 'herramientas-electricas',
  },
  {
    name: 'Fresadora Rebajadora Router 1200W Boquilla 6 y 8mm',
    description:
      'Fresadora de inmersión con tope de profundidad micrométrico, guía paralela y adaptador de aspiración.',
    price: 146000,
    stock: 11,
    categoryId: 'herramientas-electricas',
  },

  // 2. Herramientas Manuales (10)
  {
    name: 'Juego de Llaves Combinadas Cromo Vanadio 8 a 24mm (14 Piezas)',
    description:
      'Set de llaves forjadas en acero Cr-V con acabado satinado mate y organizador enrollable de lona.',
    price: 68000,
    stock: 20,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Martillo Galponero Encabado Fibra de Vidrio 20oz',
    description:
      'Martillo de uña curva con cabeza de acero forjado pulido y mango ergonómico antideslizante.',
    price: 19500,
    stock: 35,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Set de Destornilladores Magnéticos Phillips y Planos (8 Piezas)',
    description:
      'Destornilladores con varilla de cromo-molibdeno, punta negra imantada y mango bimaterial.',
    price: 27000,
    stock: 30,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Pinza Universal 8" Aislada 1000V Certificada VDE',
    description:
      'Pinza de electricista con filos templados por inducción para alambre duro y mango dieléctrico.',
    price: 24500,
    stock: 28,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Alicate de Corte Diagonal 7" Alta Palanca',
    description:
      'Alicate profesional con articulación desplazada que reduce un 35% el esfuerzo de corte.',
    price: 22000,
    stock: 26,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Caja de Tubos y Crique Encastre 1/2" y 1/4" (94 Piezas)',
    description:
      'Maletín mecánico completo con criques de 72 dientes, tubos hexagonales, prolongadores y puntas Torx.',
    price: 175000,
    stock: 10,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Llave Ajustable Francesa 10" Apertura Extra Ancha',
    description:
      'Llave regulable fosfatada con escala milimétrica grabada a láser y mordaza fina para espacios reducidos.',
    price: 26000,
    stock: 24,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Prensa Sargento Rápido 300mm Fuerza 150kg',
    description:
      'Sargento monomanual reversible a expansor con mordazas engomadas que no marcan la madera.',
    price: 21500,
    stock: 32,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Serrucho de Costilla 12" con Ingletadora Plástica',
    description:
      'Serrucho de diente fino templado triple filo ideal para cortes en ángulo de molduras y zócalos.',
    price: 23000,
    stock: 19,
    categoryId: 'herramientas-manuales',
  },
  {
    name: 'Pinza Pico de Loro 10" Ajuste con Botón PushLock',
    description:
      'Tenaza para caños con 18 posiciones de bloqueo rápido y mordazas endurecidas autoajustables.',
    price: 29500,
    stock: 21,
    categoryId: 'herramientas-manuales',
  },

  // 3. Medición y Nivelación (10)
  {
    name: 'Nivel Láser Autonivelante Líneas Cruzadas Luz Verde 30m',
    description:
      'Nivel láser de alta visibilidad con bloqueo de péndulo para transporte y soporte magnético en L.',
    price: 138000,
    stock: 11,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Cinta Métrica Profesional 8m x 25mm Doble Freno Imantada',
    description:
      'Flexómetro con carcasa engomada resistente a impactos, fleje recubierto en nylon y puntera magnética.',
    price: 16500,
    stock: 45,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Calibre Pie de Rey Digital Acero Inoxidable 150mm',
    description:
      'Calibre de precisión con pantalla LCD grande, conversión instantánea mm/pulgada y estuche rígido.',
    price: 38000,
    stock: 17,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Nivel de Burbuja Magnético Aluminio Reforzado 60cm',
    description:
      'Nivel de perfil tubular pesado con 3 viales acrílicos antichoque (horizontal, vertical y 45°).',
    price: 25000,
    stock: 28,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Medidor de Distancia Láser Digital 50 Metros IP54',
    description:
      'Telémetro láser con cálculo automático de área, volumen, Pitágoras y memoria de 20 mediciones.',
    price: 74000,
    stock: 13,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Multímetro Digital Tester True RMS Autorango con Termocupla',
    description:
      'Instrumento de medición eléctrica para tensión AC/DC, corriente, resistencia, continuidad y temperatura.',
    price: 49500,
    stock: 16,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Escuadra Combinada de Carpintero 300mm Acero Grabado',
    description:
      'Escuadra corrediza a 90° y 45° con burbuja incorporada y punzón trazador metálico en la empuñadura.',
    price: 18500,
    stock: 30,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Pinza Amperométrica Digital 600A AC con Detector NCV',
    description:
      'Pinza para medición de corriente sin contacto, retención de lectura Data Hold y linterna integrada.',
    price: 56000,
    stock: 14,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Detector de Metales, Cables con Tensión y Madera en Pared',
    description:
      'Escáner de pared multifunción con alerta sonora y pantalla retroiluminada para perforar con seguridad.',
    price: 44000,
    stock: 15,
    categoryId: 'medicion-y-nivelacion',
  },
  {
    name: 'Falsa Escuadra Profesional 250mm Mango de Aluminio',
    description:
      'Escuadra móvil con mariposa de bloqueo firme para copiar y transferir ángulos en carpintería y herrería.',
    price: 14200,
    stock: 25,
    categoryId: 'medicion-y-nivelacion',
  },

  // 4. Seguridad Industrial (10)
  {
    name: 'Careta Fotosensible para Soldar Visor Amplio DIN 9-13',
    description:
      'Máscara de soldador con 4 sensores de arco, modo amoladora, carga solar y batería de litio reemplazable.',
    price: 62000,
    stock: 16,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Guantes Anticorte Nivel 5 Recubiertos en Poliuretano (Par)',
    description:
      'Guantes tejidos en fibra HPPE de alta destreza táctil para manipulación de chapas, vidrios y herramientas.',
    price: 8900,
    stock: 60,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Protector Auditivo de Copa 27dB SNR Vincha Acolchada',
    description:
      'Orejeras de atenuación industrial plegables con almohadillas suaves para uso prolongado en taller.',
    price: 17500,
    stock: 35,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Antiparras de Seguridad Antiempañante Visión Panorámica',
    description:
      'Gafas herméticas de policarbonato con ventilación indirecta aptas para usar sobre anteojos recetados.',
    price: 7800,
    stock: 50,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Casco de Seguridad Obra con Arnés a Cremallera Amarillo',
    description:
      'Casco dieléctrico certificado con ajuste rápido a rosca, banda sudadera desmontable y ranuras laterales.',
    price: 14500,
    stock: 40,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Semimáscara Respirador Doble Filtro Vapores y Polvo',
    description:
      'Respirador reutilizable de elastómero hipoalergénico con cartuchos combinados intercambiables.',
    price: 36000,
    stock: 18,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Delantal de Cuero Descarne para Soldador 90x60cm',
    description:
      'Delantal de protección térmica cosido con hilo Kevlar y correas cruzadas regulables.',
    price: 28000,
    stock: 22,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Faja Lumbar Elastizada con Ballenas y Tiradores Ajustables',
    description:
      'Cinturón ergonómico de soporte lumbar con doble banda de ajuste en velcro para tareas de carga.',
    price: 16000,
    stock: 30,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Rodilleras Profesionales con Gel e Interior de Neopreno',
    description:
      'Rodilleras articuladas con caparazón plástico antideslizante para colocación de pisos y montaje.',
    price: 24000,
    stock: 20,
    categoryId: 'seguridad-industrial',
  },
  {
    name: 'Botín de Seguridad Cuero Flor Puntera de Acero Talle 42',
    description:
      'Calzado industrial con suela de poliuretano bidensidad resistente a hidrocarburos y plantilla anticlavo.',
    price: 84000,
    stock: 12,
    categoryId: 'seguridad-industrial',
  },

  // 5. Fijaciones y Tornillería (10)
  {
    name: 'Caja Organizadora de Tornillos Autoperforantes Madera (500 Unidades)',
    description:
      'Surtido de tornillos cabeza fresada Phillips negros y dorados en medidas de 15mm a 50mm con maletín.',
    price: 19000,
    stock: 40,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Set de Tarugos de Nylon con Tope y Tornillos N°6, N°8 y N°10 (300 Piezas)',
    description:
      'Kit de fijación para mampostería y ladrillo hueco con expansión en 4 direcciones y aletas antirotación.',
    price: 16500,
    stock: 48,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Remachadora Manual Profesional 4 Boquillas + 200 Remaches Pop',
    description:
      'Remachadora con cabezal de aluminio fundido, mordazas de acero templado y surtido de remaches de aluminio.',
    price: 26500,
    stock: 25,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Anclaje Químico Poliéster 300ml con 2 Picos Mezcladores',
    description:
      'Resina de fijación de curado rápido para varillas roscadas y cargas pesadas en hormigón y mampostería.',
    price: 23500,
    stock: 22,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Caja de Tornillos Hexagonal Autoperforantes para Techo 14x2" (250 Unidades)',
    description:
      'Tornillos con punta mecha para perfil estructural e incluyen arandela vulcanizada de neopreno.',
    price: 28500,
    stock: 30,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Engrapadora Tapicera Manual Metálica Regulador de Presión 4-14mm',
    description:
      'Clavadora y engrapadora 3 en 1 compatible con grampas rectas, grampas en U para cables y clavos.',
    price: 21000,
    stock: 27,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Surtido de Arandelas Planas, Grower y Tuercas Autofrenantes M4 a M10',
    description:
      'Caja compartimentada de 420 piezas en acero zincado para mantenimiento mecánico y electromecánico.',
    price: 22500,
    stock: 33,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Bully Expansivo Metálico Broca de Anclaje 3/8" x 75mm (Caja x 25)',
    description:
      'Anclajes mecánicos de expansión por torque para fijación de ménsulas, racks y estructuras en hormigón.',
    price: 18000,
    stock: 36,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Adhesivo Sellador Poliuretánico Construcción Gris Cartucho 310ml',
    description:
      'Sellador elástico de alta adherencia para juntas de dilatación, zingería, hormigón y carpintería metálica.',
    price: 11500,
    stock: 55,
    categoryId: 'fijaciones-y-tornilleria',
  },
  {
    name: 'Precintos Plásticos Nylon UV Negros 200x4.8mm (Bolsa x 100)',
    description:
      'Sujetacables de poliamida 6.6 resistentes a la intemperie y radiación ultravioleta para instalaciones.',
    price: 5800,
    stock: 80,
    categoryId: 'fijaciones-y-tornilleria',
  },

  // 6. Accesorios y Consumibles (10)
  {
    name: 'Set de Mechas Acero Rápido HSS Recubiertas en Titanio 1.5 a 10mm (19 Piezas)',
    description:
      'Juego de brocas rectificadas con punta split point a 135° para perforación precisa en metales y plásticos.',
    price: 34000,
    stock: 26,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Pack x 10 Discos de Corte Fino 115x1.0mm para Acero Inoxidable',
    description:
      'Discos abrasivos libres de hierro y azufre para cortes rápidos, limpios y sin rebaba con amoladora.',
    price: 14000,
    stock: 60,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Disco Diamantado Continuo Turbo 115mm para Porcelanato y Cerámica',
    description:
      'Disco de espesor ultrafino con banda diamantada sinterizada para cortes en seco o húmedo sin astillar.',
    price: 17500,
    stock: 38,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Caja de Puntas de Impacto Torsion PH2, PZ y Torx con Portapuntas (32 Piezas)',
    description:
      'Puntas tratadas térmicamente con zona de torsión que absorbe los picos de torque del atornillador de impacto.',
    price: 31000,
    stock: 29,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Juego de Mechas Copa Bimetálicas 19 a 64mm con 2 Mandriles (11 Piezas)',
    description:
      'Sierras copa con dientes M3 HSS para calados en chapa de acero, aluminio, PVC, durlock y madera.',
    price: 48000,
    stock: 15,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Set de Mechas SDS Plus Punta Widia para Hormigón 6, 8, 10 y 12mm (5 Piezas)',
    description:
      'Brocas para rotomartillo con placa de carburo de tungsteno y doble espiral de evacuación rápida de polvo.',
    price: 24500,
    stock: 34,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Bolso Porta Herramientas Boca Rígida 16" Base Plástica Impermeable',
    description:
      'Bolso de poliéster 600D con 22 bolsillos organizadores, cierre reforzado y base rígida antihumedad.',
    price: 52000,
    stock: 19,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Electrodos Revestidos Punta Azul 6013 2.5mm (Bolsa x 5 Kg)',
    description:
      'Electrodos rutilícos de encendido suave y bajo salpicado para soldadura general de estructuras de acero.',
    price: 39000,
    stock: 24,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Pack x 25 Discos de Lija con Abrojo 125mm8 Agujeros Granos Surtidos',
    description:
      'Lijas de óxido de aluminio en granos 60, 80, 120, 180 y 240 para lijadora roto orbital.',
    price: 12500,
    stock: 44,
    categoryId: 'accesorios-y-consumibles',
  },
  {
    name: 'Lubricante Multiuso Desblocante y Anticorrosivo en Aerosol 400ml',
    description:
      'Aerosol penetrante desplazador de humedad con cánula aplicadora de doble posición para mecanismos y roscas.',
    price: 9500,
    stock: 70,
    categoryId: 'accesorios-y-consumibles',
  },
];

async function seedProducts() {
  console.log(`Sembrando ${CATALOG_SEED.length} productos en King's Tools...\n`);

  for (const item of CATALOG_SEED) {
    const productRef = doc(collection(db, 'products'));

    await setDoc(productRef, {
      name: item.name,
      nameLower: item.name.toLowerCase(),
      description: item.description,
      price: item.price,
      stock: item.stock,
      categoryId: item.categoryId,
      imageUrl: PLACEHOLDER_IMAGE,
      createdAt: serverTimestamp(),
      updatedAt: serverTimestamp(),
    });

    console.log(`✔ [${item.categoryId}] ${item.name}`);
  }

  console.log(`\n✅ ${CATALOG_SEED.length} productos sembrados correctamente.`);
  process.exit(0);
}

seedProducts().catch((error: unknown) => {
  console.error('❌ Error al ejecutar el seeder:', error);
  process.exit(1);
});


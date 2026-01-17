# ts-venn Mimari ve Tasarim Dokumantasyonu

## Genel Bakis

ts-venn, SVG tabanli gorsel Venn diagram editoru uygulamasidir. React, TypeScript, Vite ve Zustand kullanilarak gelistirilmistir.

---

## Sayfa Yapisi

### 1. Login Page (`/login`)
**Dosya:** `src/features/auth/LoginPage.tsx`

Kullanici giris sayfasi. localStorage tabanli basit authentication sistemi.

**Ozellikler:**
- Email ve sifre ile giris
- Form validasyonu
- Basarili giriste ana sayfaya yonlendirme

---

### 2. Home Page (`/`)
**Dosya:** `src/features/home/HomePage.tsx`

Ana sayfa / Dashboard. Kaydedilmis diagramlarin listesi.

**Ozellikler:**
- Kaydedilmis diagram kartlari (grid layout)
- "Yeni Venn Diagram" butonu
- Diagram silme (hover'da gorunur)
- Kullanici profil menusu
- Elementler sayfasina navigasyon
- Responsive tasarim (mobil/desktop)

**Alt Komponentler:**
- `ProjectCard`: Diagram kart komponenti

---

### 3. Venn Editor Page (`/editor`, `/editor/:diagramId`)
**Dosya:** `src/features/venn-editor/VennEditorPage.tsx`

Ana editor sayfasi. Venn diagrami olusturma ve duzenleme.

**Ozellikler:**
- SVG canvas uzerinde segment olusturma
- Drag & drop ile segment tasima
- Resize handle ile boyutlandirma
- Region (kesisim) secimi
- Formula paneli
- Diagram kaydetme/yukleme
- Sol sidebar'dan element surukle-birak

**Layout:**
```
+------------------------------------------+
| Header: [<] [Diagram Adi] [...] [+] [⋮]  |
+--------+---------------------------------+
| Side-  |  Canvas Area                    |
| bar    |  (SVG Venn Diagram)             |
| [E]    |                                 |
|        +---------------------------------+
|        |  Formula Panel                  |
+--------+---------------------------------+
```

---

### 4. Elements Page (`/elements`)
**Dosya:** `src/features/elements/ElementsPage.tsx`

Segmentasyon elementleri yonetim sayfasi.

**Ozellikler:**
- Element listesi (tablo)
- Element ekleme/duzenleme (dialog)
- Element silme (onay dialog)
- Foreign Key yonetimi
- CRUD islemleri

---

## Komponent Yapisi

### Venn Editor Komponentleri

#### Canvas (`src/features/venn-editor/components/Canvas.tsx`)
Ana SVG container. Mouse event handling.

**Sorumluluklar:**
- Segment render etme (renderOrder sirasina gore)
- Region render etme
- Label render etme (ayri katman)
- Mouse down/move/up event yonetimi
- Drag & drop algilama
- Coordinate scaling (viewBox: 800x600)

**Katman Sirasi (asagidan yukariya):**
1. Regions layer
2. Segments layer
3. Labels layer

#### SegmentCircle (`src/features/venn-editor/components/SegmentCircle.tsx`)
Tekil segment (daire) komponenti.

**Icerir:**
- Daire (`<circle>`)
- Resize handle (sag kenar)

#### SegmentLabels (`src/features/venn-editor/components/SegmentCircle.tsx`)
Akilli label pozisyonlama komponenti.

**Algoritma:**
1. Diagram merkezi hesapla (tum segment merkezlerinin ortalamasi)
2. Her segment icin pozisyon belirle:
   - Ust: label ustte
   - Alt: label altta
   - Sol: label solda
   - Sag: label sagda
3. Cakisma kontrolu (diger segmentlerle)
4. Canvas sinirlari kontrolu

#### RegionElement (`src/features/venn-editor/components/RegionElement.tsx`)
Kesisim bolgeleri komponenti.

**Teknik:**
- SVG clip-path ile kesisim
- SVG mask ile cikartma (exclusion)
- Hover ve secim durumlari

#### FormulaPanel (`src/features/venn-editor/components/FormulaPanel.tsx`)
Secili bolgelerin kume notasyonu.

**Ornek Ciktilar:**
- `A ∩ B` (A ve B kesisimi)
- `(A ∩ B) - C` (A ve B kesisimi, C haric)
- `(A) ∪ (B)` (A veya B)

#### ElementsSidebar (`src/features/venn-editor/components/ElementsSidebar.tsx`)
Sol sidebar - element listesi.

**Ozellikler:**
- Collapse/expand toggle
- Draggable element kartlari
- Element listesi (storage'dan)

#### SaveDiagramDialog (`src/features/venn-editor/components/SaveDiagramDialog.tsx`)
Diagram kaydetme dialog'u.

**Alanlar:**
- Isim (zorunlu)
- Aciklama (opsiyonel)

#### LoadDiagramDialog (`src/features/venn-editor/components/LoadDiagramDialog.tsx`)
Diagram yukleme dialog'u.

**Ozellikler:**
- Kaydedilmis diagram listesi
- Silme butonu
- Tarih gosterimi

---

### Elements Komponentleri

#### ElementList (`src/features/elements/components/ElementList.tsx`)
Element tablosu.

**Kolonlar:**
- Kod
- Aciklama
- FK Sayisi
- Aksiyonlar (dropdown menu)

#### ElementForm (`src/features/elements/components/ElementForm.tsx`)
Element ekleme/duzenleme formu (Dialog icinde).

**Alanlar:**
- Kod (zorunlu, uppercase)
- Aciklama
- Foreign Keys (ForeignKeyEditor)

#### ForeignKeyEditor (`src/features/elements/components/ForeignKeyEditor.tsx`)
Foreign key yonetim komponenti.

**Ozellikler:**
- Mevcut FK listesi
- Yeni FK ekleme (tablo + kolon)
- FK silme

#### DeleteDialog (`src/features/elements/components/DeleteDialog.tsx`)
Genel amacli silme onay dialog'u.

---

### UI Komponentleri (`src/components/ui/`)

shadcn/ui tabanli komponentler:

| Komponent | Kullanim |
|-----------|----------|
| `button` | Butonlar |
| `card` | Kart container |
| `dialog` | Modal dialog |
| `alert-dialog` | Onay dialog |
| `dropdown-menu` | Acilir menu |
| `input` | Text input |
| `label` | Form label |
| `textarea` | Cok satirli input |
| `table` | Tablo |
| `avatar` | Kullanici avatar |
| `separator` | Ayirici cizgi |

---

## State Yonetimi

### Editor State (`src/features/venn-editor/state/editorState.ts`)
Zustand store - editor durumu.

**State:**
```typescript
{
  segments: Record<string, Segment>  // Tum segmentler
  segmentList: Segment[]             // Liste formati
  renderOrder: Segment[]             // Render sirasi
  regions: Region[]                  // Hesaplanmis bolgeler
  dragging: DragState | null         // Surukleme durumu
  resizing: ResizeState | null       // Boyutlandirma durumu
  nextId: number                     // Sonraki segment ID
  diagramId: string | null           // Yuklenmis diagram ID
  diagramName: string | null         // Diagram adi
}
```

**Onemli Aksiyonlar:**
- `addSegment`: Yeni segment ekle
- `addSegmentFromElement`: Element'ten segment olustur
- `toggleRegion`: Bolge secimini toggle
- `startDrag/drag/endDrag`: Surukleme
- `loadDiagram`: Diagram yukle
- `clearDiagram`: Temizle

**Persistence:**
- localStorage ile otomatik kayit
- `selectedRegionIds` korunuyor

### Elements State (`src/features/elements/state/elementsState.ts`)
Zustand store - element yonetimi.

**Aksiyonlar:**
- `fetchElements`: Tum elementleri getir
- `createElement`: Yeni element
- `updateElement`: Guncelle
- `deleteElement`: Sil

### Auth State (`src/features/auth/state/authState.ts`)
Zustand store - authentication.

**State:**
```typescript
{
  user: User | null
  isAuthenticated: boolean
}
```

---

## Storage Katmani

### Interface (`src/services/storage/types.ts`)

```typescript
interface IElementStorage {
  getAll(): Promise<Element[]>
  getById(id: string): Promise<Element | null>
  create(element: ...): Promise<Element>
  update(id: string, ...): Promise<Element>
  delete(id: string): Promise<void>
}

interface IDiagramStorage {
  // Ayni yapilar
}
```

### LocalStorage Implementation (`src/services/storage/localStorage.ts`)

Simdilik localStorage kullaniliyor. Ileride API'ye gecis icin interface hazir.

**Storage Keys:**
- `ts-venn-elements`: Element listesi
- `ts-venn-diagrams`: Diagram listesi
- `ts-venn-editor`: Editor state (Zustand persist)
- `ts-venn-auth`: Auth state

---

## Veri Modelleri

### Segment
```typescript
interface Segment {
  id: string
  name: string
  code: string           // "A", "B", "C"...
  cx: number             // Merkez X
  cy: number             // Merkez Y
  radius: number
  parentId: string | null
  children: string[]
  selected: boolean
  elementId?: string     // Bagli element
}
```

### Region
```typescript
interface Region {
  id: string             // "A", "A∩B", "A∩B∩C"...
  segmentIds: string[]   // Kesisen segment ID'leri
  selected: boolean
}
```

### Element
```typescript
interface Element {
  id: string
  code: string           // "USR", "ORD"...
  description: string
  foreignKeys: ForeignKey[]
  createdAt: string
  updatedAt: string
}
```

### SavedDiagram
```typescript
interface SavedDiagram {
  id: string
  name: string
  description: string
  segments: SavedSegment[]
  selectedRegionIds: string[]
  createdAt: string
  updatedAt: string
}
```

---

## Routing

```typescript
/login              -> LoginPage
/                   -> HomePage (protected)
/editor             -> VennEditorPage (protected)
/editor/:diagramId  -> VennEditorPage (protected)
/elements           -> ElementsPage (protected)
```

**ProtectedRoute:** Giris yapmamis kullanicilari `/login`'e yonlendirir.

---

## Responsive Tasarim

### Breakpoints
- Mobile: < 640px (sm)
- Tablet: 640px - 768px (md)
- Desktop: > 768px

### Mobile Uyumluluklari
- Header butonlari dropdown menu'de
- Sidebar collapse edilebilir
- Canvas viewBox ile olceklenir
- Touch-friendly buton boyutlari
- Overflow kontrolu

---

## CSS / Styling

### Tailwind CSS v4
- `@import "tailwindcss"` syntax
- `@theme` ile custom renkler

### Tema Renkleri
```css
--color-background: hsl(222 47% 11%)   /* Koyu mavi */
--color-primary: hsl(346 77% 50%)      /* Kirmizi/Pembe */
--color-foreground: hsl(210 40% 98%)   /* Beyaz */
```

### SVG Stilleri
- `.segment-circle`: Daire stroke
- `.segment-label`: Label text
- `.region-fill`: Bolge fill
- `.resize-handle`: Boyutlandirma noktasi

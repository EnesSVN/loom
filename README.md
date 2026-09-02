# loom

Sıfır bağımlılıkla yazılmış bir full-stack JavaScript framework'ü:
frontend (VDOM + reactivity + router), backend (HTTP + routing + data + auth)
ve bir arama motoru.

## Neden

Bu bir öğrenme projesi. Amaç framework yazmak değil; framework'lerin
yaptığı işi bizzat yaparak JavaScript'i, veri yapılarını ve mimari
kararları derinlemesine öğrenmek. Çıkan ürün bir yan etki.

`dependencies` boş. Sadece Node'un built-in modülleri kullanılıyor.

## Paketler

| Paket | İçerik |
|---|---|
| `@loom/core` | VDOM, reactivity, component, router, store |
| `@loom/server` | HTTP, routing, middleware, DI, data, auth |
| `@loom/search` | Inverted index, BM25, trie, fuzzy arama |

## Kurulum

Node 22+ gerekiyor.

```bash
npm install
npm test
```

`npm install` hiçbir bağımlılık indirmez; yalnızca workspace paketlerini
birbirine bağlar.

## Durum

Faz 0 — kurulum. Yol haritası için `ROADMAP.md`,
mimari kararlar için `docs/adr/`.

## Benchmark'lar

Faz 10'da doldurulacak.

## Lisans

MIT

# Agentic Coding in der PR · Mini-Lesson (PWA)

**Learning Factory** · Mobile Lern-App für Presse und Öffentlichkeitsarbeit: 7 Kurzlektionen, Kurz-Checks, Praxisaufgabe mit fiktiver Pressemitteilung, Abschlussquiz und Prüf-Checkliste.
Installierbar wie eine App, läuft offline.

```
agentic-coding-pr/
├── index.html              ← App-Shell (Ansichten, Quiz-Logik, Fortschritt)
├── lesson.js               ← alle Inhalte (Lektionen, Quiz, Prüf-Checkliste)
├── manifest.webmanifest    ← PWA-Metadaten
├── sw.js                   ← Service Worker (Offline-Cache)
├── icon-192.png / icon-512.png / icon-maskable-512.png
└── ANLEITUNG.md            ← dieses Dokument
```

## Lokal testen

```bash
cd agentic-coding-pr
python -m http.server 5501
```

Öffnen: <http://localhost:5501>. Hinweis: Manche Ports (z. B. 8765) sind unter Windows durch Hyper-V reserviert
und liefern `WinError 10013`. Dann einfach einen anderen Port nehmen.

## Veröffentlichen

Eine PWA mit Offline-Funktion braucht **HTTPS**. Wie beim Glossar geht das z. B. über GitHub Pages, Netlify oder Cloudflare Pages:
Ordnerinhalt hochladen, den Link an die Studierenden geben. Auf dem Handy:

- **iPhone (Safari):** Teilen → „Zum Home-Bildschirm“
- **Android (Chrome/Edge):** Button „Als App installieren“ in der App oder Browser-Menü → „App installieren“


### Eigenes Hosting (z. B. Strato)

1. Im Kundenbereich das **SSL-Zertifikat** für die Domain aktivieren.
2. Per **SFTP** verbinden (z. B. mit WinSCP oder FileZilla). Server, Benutzer und Passwort stehen in der SFTP/FTP-Verwaltung.
3. Ordner anlegen, z. B. `agentic`, und hochladen:
   `index.html`, `lesson.js`, `manifest.webmanifest`, `sw.js`, die drei Icons und **`.htaccess`**.
   **Nicht** hochladen: den Ordner `.git` und `ANLEITUNG.md`.
4. Aufrufen: `https://deine-domain.de/agentic/`

Die `.htaccess` setzt den richtigen Dateityp für das Manifest, leitet `http://` auf `https://` um
und verhindert, dass `sw.js` lange zwischengespeichert wird. Windows-Explorer blendet Dateien mit Punkt am Anfang
manchmal aus. In WinSCP/FileZilla ist sie sichtbar.

## Inhalte ändern

Alles steht in `lesson.js`. Schritt-Typen:

| Typ | Felder |
|---|---|
| `text` | `title`, `html` |
| `quiz` | `q`, `options`, `correct` (Index ab 0), `explain` |
| `task` | `title`, `html` (Praxisaufgabe am eigenen Rechner) |

Fortschritt und Quiz-Bestwert werden pro Gerät im Browser gespeichert (`localStorage`). Es werden keine Daten an einen Server gesendet.

## Updates ausrollen

Bei jeder Änderung an `index.html`, `lesson.js` oder den Icons in `sw.js` die `CACHE_VERSION` hochzählen
(z. B. `v1.0.0` → `v1.0.1`). Sonst sehen installierte Apps eventuell noch den alten Stand.

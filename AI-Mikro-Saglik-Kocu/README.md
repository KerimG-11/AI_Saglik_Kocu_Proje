# AI Mikro Saglik Kocu

Modern, responsive, web tabanli mikro saglik takibi ve oneriler platformu.

## Ozellikler
- JWT tabanli kayit/giris ve korumali API'ler
- Gunluk saglik verisi kaydi (uyku, adim, su, stres)
- If-else kurallarina dayali mikro oneri uretimi
- Bildirim ve veri gecmisi ekranlari
- Modern dashboard tasarimi (mobil/tablet/masaustu uyumlu)

## Klasor Yapisi
```text
AI-Mikro-Saglik-Kocu/
  client/
    public/
      index.html
      styles.css
      app.js
  server/
    src/
      app.js
      server.js
      config/
      controllers/
      middlewares/
      models/
      routes/
      utils/
    sql/
      schema.sql
    .env.example
    package.json
  package.json
  README.md
```

## Kurulum
1. SQL Server (SSMS) uzerinde bir instance'in calistigindan emin olun.
2. `server/.env.example` dosyasini `server/.env` olarak kopyalayin ve bilgileri doldurun.
3. Proje kokunde bagimliliklari yukleyin:
   ```bash
   npm run install:all
   ```
4. Veritabani tablolarini olusturun:
   - `server/sql/schema.sql` dosyasini SSMS'te acip Execute edin.
5. Uygulamayi tek komutla baslatin:
   ```bash
   npm run dev
   ```
6. Tarayicida acin: [http://localhost:5000](http://localhost:5000)

## Ilk Kullanim
- Ilk kullanimda `Kayit Ol` ekranindan yeni bir hesap olusturun.
- `schema.sql` icindeki fake veri, tablo yapisini test etmek icin eklenmistir.

## API Endpointleri

### Auth
- `POST /api/register`
- `POST /api/login`

### Health Data
- `POST /api/health`
- `GET /api/health/history`

### Recommendations
- `GET /api/recommendations`

### Notifications
- `GET /api/notifications`

## Guvenlik
- bcrypt ile sifre hashleme
- JWT dogrulama middleware'i
- Hazirlanmis sorgular ile SQL injection korumasi
- Input validation

## SQL Server Notu
- Varsayilan olarak `DB_TRUSTED_CONNECTION=true` ayari ile Windows Authentication kullanilir.
- SQL Login kullanmak isterseniz `DB_TRUSTED_CONNECTION=false` yapip `DB_USER` ve `DB_PASSWORD` bilgilerini girin.

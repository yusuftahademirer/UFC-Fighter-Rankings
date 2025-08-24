This is a [Next.js](https://nextjs.org) project bootstrapped with [`create-next-app`](https://nextjs.org/docs/app/api-reference/cli/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
# or
pnpm dev
# or
bun dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/app/building-your-application/deploying) for more details.

# (EN) MMA Fighter Panel

This project is a panel application developed with Next.js and Prisma to manage and rank UFC fighters.  
Only admin users can perform operations in the panel, and secure session management is provided via JWT.

---

## Features

- Fetch fighters from an external API and save them to the database
- Manage weight class and pound-for-pound rankings
- Add, delete, and reorder fighters in the panel (with up/down buttons)
- Admin login and secure session management (JWT + HttpOnly Cookie)
- Modern architecture with Next.js 13+ and Prisma

---

## Setup

1. **Clone the project:**
   ```bash
   git clone https://github.com/yourusername/project-name.git
   cd project-name
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set environment variables:**

   Create a `.env.local` file in the project root and fill it with the following example:
   ```
   ADMIN_USERNAME=admin
   ADMIN_PASSWORD=your-strong-password
   JWT_SECRET=your-secret-key
   ```

4. **Initialize the database:**
   ```bash
   npx prisma migrate dev
   # or
   npx prisma db push
   ```

5. **Run the project:**
   ```bash
   npm run dev
   ```

---

## Usage

- Home page: `http://localhost:3000`
- Panel: `http://localhost:3000/panel`
  - Admin login is required to access the panel.

---

## Security

- Password and JWT secret are stored in `.env.local` and **should not be committed to git**.
- Session management is handled with JWT and HttpOnly cookies.
- The panel page is only accessible after admin login.

---

## Contribution & License

- Feel free to send pull requests for contributions.
- Shared under an open source license.

---

## Environment Variable Example

```
ADMIN_USERNAME=admin-username
ADMIN_PASSWORD=your-strong-password
JWT_SECRET=your-secret-key
```

---

**For questions, please


# (TR) MMA Fighter Panel

Bu proje, UFC dövüşçülerini yönetmek ve sıralamak için Next.js ve Prisma ile geliştirilmiş bir panel uygulamasıdır.  
Panelde sadece admin girişi ile işlem yapılabilir ve güvenli oturum yönetimi JWT ile sağlanır.

---

## Özellikler

- Harici API'den dövüşçüleri çekip veritabanına kaydetme
- Siklet ve pound-for-pound sıralaması yönetimi
- Panelde dövüşçü ekleme, silme, sıralama (yukarı/aşağı butonları ile)
- Admin girişi ve güvenli oturum yönetimi (JWT + HttpOnly Cookie)
- Next.js 13+ ve Prisma ile modern mimari

---

## Kurulum

1. **Projeyi klonlayın:**
   ```bash
   git clone https://github.com/kullaniciadi/proje-adi.git
   cd proje-adi
   ```

2. **Bağımlılıkları yükleyin:**
   ```bash
   npm install
   ```

3. **Ortam değişkenlerini ayarlayın:**

   Proje köküne `.env.local` dosyası oluşturun ve aşağıdaki örneği doldurun:
   ```
   ADMIN_USERNAME=admin-username
   ADMIN_PASSWORD=buraya-güçlü-bir-şifre-yazın
   JWT_SECRET=buraya-gizli-bir-anahtar-yazın
   ```

4. **Veritabanını başlatın:**
   ```bash
   npx prisma migrate dev
   # veya
   npx prisma db push
   ```

5. **Projeyi çalıştırın:**
   ```bash
   npm run dev
   ```

---

## Kullanım

- Ana sayfa: `http://localhost:3000`
- Panel: `http://localhost:3000/panel`
  - Panelde işlem yapmak için admin girişi gereklidir.

---

## Güvenlik

- Şifre ve JWT anahtarı `.env.local` dosyasında tutulur, **git'e eklenmemelidir**.
- Oturum yönetimi JWT ve HttpOnly cookie ile yapılır.
- Panel sayfası sadece admin girişi ile erişilebilir.

---

## Katkı ve Lisans

- Katkı yapmak için pull request gönderebilirsiniz.
- Açık kaynak lisansı ile paylaşılmıştır.

---

## Ortam Değişkeni Örneği

```
ADMIN_USERNAME=admin
ADMIN_PASSWORD=buraya-güçlü-bir-şifre-yazın
JWT_SECRET=buraya-gizli-bir-anahtar-yazın
```

---

**Sorularınız için issue açabilirsiniz!**
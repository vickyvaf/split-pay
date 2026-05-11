# Split-Pay + AI Agent PRD and Test Cases

## Product Overview

Split-Pay adalah MiniApp untuk MiniPay yang membantu pengguna membagi tagihan dan menagih pembayaran teman secara langsung dalam cUSD di Celo Mainnet.

Aplikasi tetap menggunakan pendekatan zero escrow: pembayaran dikirim langsung dari pembayar ke inisiator, sementara smart contract hanya bertugas sebagai router/pencatat status pembayaran. Di atas core ini, ditambahkan AI Agent yang bisa menjawab pertanyaan bahasa natural seputar status hutang/piutang dan membantu follow-up pembayaran.

## Product Vision

Menyediakan cara paling cepat dan mudah untuk patungan tagihan di MiniPay tanpa perlu transfer manual satu per satu, follow-up chat berulang, atau pencatatan pembayaran terpisah, ditambah asisten AI yang bisa menjawab pertanyaan natural language tentang siapa yang sudah/lunas, siapa yang masih hutang, dan membantu mengirim reminder.

## Problem Statement

Pada skenario makan bersama, perjalanan kelompok, iuran komunitas, atau kebutuhan patungan lain, satu orang biasanya membayar lebih dulu lalu harus menagih beberapa orang secara manual dan memantau progresnya secara mental atau lewat catatan terpisah.

Tanpa bantuan, inisiator sering lupa siapa saja yang belum bayar, status Budi/Ani sudah lunas atau belum, serta kapan terakhir kali mengingatkan. AI Agent dapat membaca data tagihan dan transaksi untuk menjawab pertanyaan seperti “siapa aja temanku yang belum bayar sampai sekarang?”, “apakah Budi punya hutang yang belum dibayar?”, atau “berapa total hutang yang belum masuk dari grup Arisan RT?”.

Program Proof of Ship Season 2 mendorong MiniApps yang menghasilkan aktivitas onchain nyata, termasuk integrasi AI Agents dengan use case untuk MiniPay, sehingga menambah lapisan AI di Split-Pay meningkatkan relevansi dengan campaign.

## Goals

- Memungkinkan inisiator membuat tagihan grup dalam waktu kurang dari 2 menit.
- Memungkinkan anggota grup membayar bagiannya dalam maksimal 3 langkah inti: buka link, konfirmasi, bayar.
- Menampilkan status pembayaran per anggota secara jelas: Pending atau Paid.
- Menghasilkan transaksi on-chain nyata di Celo Mainnet sebagai bukti penggunaan produk.
- Menjaga arsitektur tetap sederhana, open source, dan kompatibel dengan stack yang direkomendasikan untuk MiniPay (Mini Apps).
- (AI) Memungkinkan pengguna menanyakan status hutang/piutang dalam bahasa natural (Indonesia/Inggris) dan mendapatkan jawaban langsung berdasarkan data BillGroup + BillMember + event onchain.
- (AI) Memungkinkan pengguna mengirim reminder ke anggota yang belum bayar langsung dari percakapan dengan AI Agent.

## Non-Goals

- Menjadi aplikasi escrow atau marketplace dengan dispute resolution.
- Menyimpan dana pengguna di smart contract.
- Mendukung banyak token selain cUSD pada versi awal.
- Menyediakan recurring bills, subscription, atau pembagian nominal custom pada versi awal.
- (AI) Memberi saran keuangan/investasi di luar konteks status hutang/piutang dalam Split-Pay.
- (AI) Mengambil keputusan pembayaran otomatis tanpa konfirmasi eksplisit pengguna.

## Target Users

### Inisiator

Pengguna MiniPay yang sudah membayar tagihan terlebih dahulu dan ingin menagih beberapa teman dengan cepat melalui link pembayaran, serta ingin dengan cepat melihat siapa yang belum membayar dan memicu reminder lewat percakapan dengan AI.

### Anggota Grup

Teman yang menerima link pembayaran, membuka detail tagihan, lalu menyelesaikan pembayaran melalui MiniPay jika saldo cUSD mencukupi, dan opsional dapat menanyakan status tagihannya sendiri ke AI Agent (misal: “aku ada hutang di grup yang mana aja?”).

### AI Agent Consumer

Pengguna (biasanya inisiator, tapi bisa juga anggota) yang berinteraksi dengan antarmuka chat AI di dalam MiniApp untuk:

- Bertanya tentang status tagihan dan anggota.
- Meminta rekap hutang/piutang.
- Menginstruksikan pengiriman reminder ke anggota yang belum bayar.

## Use Cases

- Patungan makan bersama.
- Patungan transportasi atau bensin.
- Iuran komunitas atau acara kecil.
- Reimbursement sederhana antar teman.
- (AI) “Siapa aja temanku yang belum bayar sampai sekarang?” untuk satu grup atau semua grup aktif.
- (AI) “Apakah Budi punya hutang yang belum dibayar?” dan mendapatkan detail grup + nominal.
- (AI) “Kirim pengingat ke semua yang belum bayar di grup Dinner Bandung.”
- (AI) “Berapa total cUSD yang masih pending buatku sekarang?”
- (AI) “Tagihan mana saja yang sudah selesai minggu ini?”

## User Stories

### Existing User Stories (Core)

| ID | Role | User Story | Priority |
|---|---|---|---|
| US-01 | Inisiator | Sebagai inisiator, saya ingin connect wallet agar aplikasi mengenali identitas dan alamat pembayaran saya. | P0 |
| US-02 | Inisiator | Sebagai inisiator, saya ingin membuat grup tagihan dengan nama grup dan total tagihan agar sistem menghitung nominal per anggota. | P0 |
| US-03 | Inisiator | Sebagai inisiator, saya ingin menghasilkan payment link per anggota agar bisa dibagikan lewat WhatsApp atau Telegram. | P0 |
| US-04 | Anggota | Sebagai anggota, saya ingin membuka payment link dan melihat detail tagihan saya sebelum membayar. | P0 |
| US-05 | Anggota | Sebagai anggota, saya ingin diarahkan untuk menginstal MiniPay bila saya belum membukanya di lingkungan yang kompatibel. | P0 |
| US-06 | Anggota | Sebagai anggota, saya ingin mengetahui jika saldo cUSD saya belum cukup dan melihat opsi top up. | P0 |
| US-07 | Anggota | Sebagai anggota, saya ingin membayar langsung ke inisiator agar proses cepat dan jelas. | P0 |
| US-08 | Inisiator | Sebagai inisiator, saya ingin melihat siapa yang sudah membayar dan siapa yang masih pending. | P0 |
| US-09 | Inisiator | Sebagai inisiator, saya ingin mengirim ulang payment link ke anggota yang belum membayar. | P1 |
| US-10 | Sistem | Sebagai sistem, saya ingin menandai tagihan selesai saat semua anggota telah membayar. | P0 |

### AI Agent User Stories

| ID | Role | User Story | Priority |
|---|---|---|---|
| US-AI-01 | Inisiator | Sebagai inisiator, saya ingin bertanya “siapa aja temanku yang belum bayar sampai sekarang?” agar saya bisa cepat melihat siapa yang masih Pending tanpa harus cek satu per satu di dashboard. | P0 |
| US-AI-02 | Inisiator | Sebagai inisiator, saya ingin bertanya “apakah Budi punya hutang yang belum dibayar?” agar saya bisa tahu status pembayaran Budi di semua grup yang saya buat. | P0 |
| US-AI-03 | Inisiator | Sebagai inisiator, saya ingin meminta “kirim pengingat ke semua yang belum bayar di grup [nama grup]” agar AI Agent bisa menyiapkan dan men-trigger pengiriman link reminder lewat WhatsApp/Telegram. | P1 |
| US-AI-04 | Inisiator | Sebagai inisiator, saya ingin bertanya “berapa total cUSD yang masih pending buatku?” agar saya mendapat ringkasan nominal hutang yang belum dibayar. | P1 |
| US-AI-05 | Anggota | Sebagai anggota, saya ingin bertanya “aku ada hutang apa saja?” agar saya bisa melihat daftar tagihan yang masih Pending atas nama saya. | P2 |
| US-AI-06 | Sistem | Sebagai sistem, saya ingin mengubah pertanyaan natural language menjadi query terstruktur ke data BillGroup/BillMember dan onchain event sehingga jawaban AI selalu konsisten dengan status pembayaran. | P0 |
| US-AI-07 | Sistem | Sebagai sistem, saya ingin memastikan AI Agent hanya dapat mengakses data tagihan yang relevan dengan wallet pengguna yang sedang login untuk menjaga privasi. | P0 |

## User Flow

### Core Split-Pay Flow

1. Inisiator membuka Split-Pay di MiniPay Browser.
2. Inisiator menghubungkan wallet melalui provider yang tersedia di MiniPay.
3. Inisiator membuat grup tagihan dengan mengisi nama grup, total tagihan, dan daftar anggota.
4. Sistem menghitung nominal per anggota secara equal split.
5. Sistem membuat payment request link untuk tiap anggota.
6. Inisiator membagikan link melalui WhatsApp atau Telegram.
7. Anggota membuka payment link.
8. Sistem memeriksa apakah lingkungan pengguna kompatibel dengan MiniPay.
9. Jika tidak kompatibel, pengguna diarahkan ke instalasi atau pembukaan MiniPay.
10. Jika kompatibel, sistem memeriksa saldo cUSD.
11. Jika saldo tidak cukup, tombol top up ditampilkan.
12. Jika saldo cukup, detail tagihan ditampilkan.
13. Anggota dapat membatalkan atau mengonfirmasi pembayaran.
14. Saat pembayaran dikonfirmasi, transfer cUSD dilakukan ke alamat inisiator dan status pembayaran dicatat.
15. Setelah transaksi terkonfirmasi di Celo Network, status anggota berubah menjadi Paid.
16. Dashboard inisiator memperlihatkan progres pembayaran.
17. Saat semua anggota telah membayar, tagihan berubah menjadi selesai.

### AI Agent Flow (Inisiator)

1. Inisiator membuka Split-Pay di MiniPay Browser dan connect wallet.
2. Inisiator membuka tab/section “AI Assistant” di dalam MiniApp.
3. Inisiator mengetik pertanyaan natural language, misalnya:
   - “Siapa aja temanku yang belum bayar sampai sekarang?”
   - “Apakah Budi punya hutang yang belum dibayar?”
4. Sistem mengirim query ke AI backend beserta context:
   - `initiatorAddress`
   - daftar BillGroup + BillMember terkait address tersebut
   - snapshot status pembayaran, termasuk event onchain terakhir.
5. AI Agent melakukan intent detection (contoh intent: `LIST_PENDING_MEMBERS`, `CHECK_MEMBER_STATUS`, `TOTAL_PENDING_AMOUNT`) dan parameter extraction (contoh: `memberName = "Budi"`, `groupName = "Arisan RT"`).
6. Sistem menjalankan query terstruktur ke database/backend untuk mendapatkan data aktual, lalu AI Agent merangkai jawaban natural language dari hasil tersebut.
7. Jawaban ditampilkan di UI chat, misalnya:
   - “Di grup ‘Dinner Jakarta’, yang belum bayar: Andi (10 cUSD), Sari (10 cUSD). Total pending 20 cUSD.”
8. Jika intent berkaitan dengan reminder (misal “kirim pengingat ke semua yang belum bayar”), AI Agent meminta konfirmasi singkat dan kemudian memicu aksi “Resend link” untuk anggota Pending (menampilkan sheet share WhatsApp/Telegram per anggota).
9. Inisiator dapat menekan quick action (chip) yang disarankan AI, misalnya “Lihat detail grup”, “Kirim semua reminder”, atau “Salin ringkasan ke clipboard.”

### AI Agent Flow (Anggota)

1. Anggota membuka Split-Pay dan connect wallet.
2. Anggota membuka tab AI Assistant.
3. Anggota bertanya “Aku ada hutang apa saja?”.
4. Sistem melimit context ke BillMember dimana `walletAddress` atau identitas anggota cocok dengan wallet pengguna.
5. AI mengembalikan list tagihan yang masih Pending + link untuk membayar masing-masing.

## Functional Requirements

### FR-01 Wallet Connection

- Sistem harus mendeteksi provider wallet dari MiniPay melalui `window.ethereum`.
- Integrasi wallet harus menggunakan library yang kompatibel dengan MiniPay (misalnya viem/wagmi untuk Celo).
- Address wallet inisiator menjadi identitas utama untuk menerima pembayaran.

### FR-02 Bill Group Creation

- Inisiator dapat membuat grup tagihan dengan field minimum: nama grup, total tagihan, jumlah anggota, dan daftar anggota.
- Sistem harus membagi total tagihan secara rata pada versi 1.
- Sistem harus menyimpan metadata grup dan nominal per anggota.

### FR-03 Payment Request Link

- Sistem harus menghasilkan link unik per anggota.
- Link harus membawa informasi minimal: `groupId`, `memberId`, `amount`, dan `recipientAddress`.
- Link harus dapat dibagikan melalui aplikasi pesan seperti WhatsApp dan Telegram.

### FR-04 Payment Link Landing

- Saat link dibuka, sistem harus menampilkan halaman detail pembayaran yang sesuai dengan anggota terkait.
- Sistem harus mendeteksi apakah pengguna berada di environment MiniPay yang kompatibel.
- Jika tidak kompatibel, sistem harus menampilkan ajakan instalasi atau membuka MiniPay.

### FR-05 Balance Check

- Sistem harus memeriksa saldo cUSD pengguna sebelum tombol bayar diaktifkan.
- Jika saldo tidak cukup, sistem harus menampilkan status insufficient balance dan tombol top up.
- Setelah top up selesai, pengguna harus dapat mencoba kembali proses pembayaran.

### FR-06 Payment Execution

- Saat pengguna menekan bayar, sistem harus meminta konfirmasi transaksi dari wallet.
- Pembayaran harus dikirim langsung ke wallet inisiator; smart contract tidak menyimpan dana pengguna.
- Setelah transaksi berhasil, status pembayaran anggota harus diperbarui menjadi Paid.

### FR-07 Smart Contract Layer

- Smart contract hanya berfungsi sebagai zero escrow router atau payment recorder.
- Contract harus mengeluarkan event pembayaran untuk pencatatan dan pelacakan status.
- Deploy harus dilakukan di Celo Mainnet dengan verified smart contracts agar memenuhi syarat Proof of Ship.

### FR-08 Initiator Dashboard

- Dashboard harus menampilkan seluruh anggota beserta status Pending atau Paid.
- Dashboard harus menampilkan progress jumlah pembayaran yang sudah lunas.
- Dashboard harus menyediakan aksi kirim ulang link untuk anggota yang masih Pending.

### FR-09 Bill Completion

- Sistem harus otomatis menandai tagihan selesai jika semua anggota berstatus Paid.
- Sistem harus menampilkan status selesai secara jelas pada dashboard inisiator.

### FR-10 Open Source and Deployment

- Repositori harus public atau dapat dilacak sesuai ketentuan Proof of Ship.
- Aplikasi harus live dan dapat diakses selama periode evaluasi.

### FR-AI-01 AI Assistant Entry Point

- Sistem harus menyediakan entry point AI Assistant di dalam MiniApp (misalnya tab, tombol “Tanya AI”, atau floating action) yang hanya dapat diakses setelah wallet terkoneksi.
- UI chat harus mendukung input teks dalam Bahasa Indonesia dan Inggris.
- Riwayat percakapan minimal disimpan per sesi (tab aktif); versi lanjut bisa menambahkan riwayat per user.

### FR-AI-02 Intent Detection & NLU

- Sistem AI harus bisa mengenali intent utama berikut:
  - `LIST_PENDING_MEMBERS` (contoh query: “siapa aja yang belum bayar?”).
  - `CHECK_MEMBER_STATUS` (contoh: “apakah Budi sudah bayar?”).
  - `TOTAL_PENDING_AMOUNT` (contoh: “berapa total yang belum dibayar?”).
  - `LIST_USER_DEBTS` (untuk anggota: “hutangku apa aja?”).
  - `SEND_REMINDERS` (contoh: “kirim pengingat ke semua yang belum bayar”).
- Sistem harus mengekstrak entity penting:
  - Nama grup (groupName).
  - Nama anggota (displayName).
  - Range waktu (jika ada, misal “minggu ini” → filter createdAt/paidAt).
- Jika intent/parameter tidak jelas, AI harus meminta klarifikasi singkat.

### FR-AI-03 Data Access Layer (Read-Only)

- AI Agent hanya boleh membaca:
  - BillGroup di mana `initiatorAddress` = wallet pengguna (untuk inisiator).
  - BillMember terkait grup tersebut.
  - BillMember yang `walletAddress` = wallet pengguna (untuk anggota).
- Semua query ke data harus dilakukan via backend API yang sudah meng-handle authorization berdasarkan wallet address.
- AI tidak boleh mengakses data tagihan wallet lain yang tidak terhubung.

### FR-AI-04 Answer Generation

- Jawaban AI harus konsisten dengan data terkini di backend:
  - Untuk jumlah pending, AI harus menggunakan perhitungan `sum(amountDue where status = 'pending')`.
  - Untuk status individu, AI harus menyebut status (Pending/Paid), nominal, dan nama grup.
- Jika tidak ada hutang yang pending, AI harus menjawab secara eksplisit, misalnya: “Semua anggota sudah lunas untuk semua grup aktif.”

### FR-AI-05 Reminder Actions via AI

- Untuk intent `SEND_REMINDERS`, AI harus:
  - Menampilkan ringkasan anggota Pending + nominal + grup.
  - Meminta konfirmasi: “Ingin kirim reminder ke X orang ini sekarang?”
  - Setelah konfirmasi, memanggil fungsi existing `resend link` per anggota dan membuka share sheet (WhatsApp/Telegram) untuk pengguna.
- AI tidak boleh secara otomatis mengirim pesan ke luar tanpa interaksi user; ia hanya membantu mempersingkat klik.

### FR-AI-06 Error Handling & Fallback

- Jika AI backend tidak dapat diakses, UI harus:
  - Menampilkan pesan error yang jelas.
  - Menawarkan shortcut ke dashboard manual (tanpa AI).
- Jika pertanyaan pengguna di luar domain (misal minta prediksi harga kripto), AI harus menolak secara sopan dan mengarahkan kembali ke fungsi Split-Pay.

### FR-AI-07 AI Agent Metrics Tracking

- Sistem harus mencatat minimal:
  - Jumlah query AI per user.
  - Intent distribution (berapa banyak `LIST_PENDING_MEMBERS`, `SEND_REMINDERS`, dll.).
  - Conversion ke action (misal, berapa banyak reminder yang akhirnya dikirim setelah rekomendasi AI).

## Non-Functional Requirements

| Category | Requirement |
|---|---|
| Performance | Landing page payment harus terbuka cepat di perangkat mobile, dan status transaksi harus diperbarui segera setelah konfirmasi jaringan. |
| Compatibility | UI harus mobile-first karena MiniPay digunakan sebagai wallet mobile. Fokus utama ada pada MiniPay browser dan perangkat Android. |
| Reliability | Sistem harus tetap menampilkan status Pending jika transaksi gagal atau dibatalkan. |
| Security | Tidak boleh menyimpan private key atau seed phrase; seluruh signing dilakukan oleh wallet pengguna. |
| Maintainability | Frontend dan contract harus menggunakan stack yang umum direkomendasikan dalam ekosistem Celo seperti Celo-Composer, Next.js, dan Hardhat. |
| Compliance | Konsep produk harus menghindari custody-heavy DeFi patterns karena program secara eksplisit tidak mendorong solo builder membangun aplikasi yang mengelola dana pengguna tanpa audit dan kesiapan regulasi. |

### Additional Non-Functional (AI)

| Category | Requirement |
|---|---|
| Performance | Waktu respon AI idealnya < 3 detik untuk query sederhana (list pending, status satu member). |
| Reliability | Jika AI timeout atau error, user masih bisa mengakses dashboard manual tanpa kehilangan data. |
| Privacy | Data tagihan tidak boleh dikirim ke model pihak ketiga tanpa anonimisasi/aggregasi sesuai kebijakan. |
| Security | Konteks yang dikirim ke AI harus di-scope ketat ke wallet pengguna; tidak boleh ada data sensitif lain. |
| Maintainability | Intent + entity mapping harus mudah di-extend (konfigurasi atau file terpisah). |

## UX Requirements

- Halaman pembuatan tagihan harus memiliki form sesingkat mungkin.
- Nominal per anggota harus langsung terlihat setelah total tagihan dimasukkan.
- Halaman pembayaran harus menonjolkan nama grup, nominal, alamat penerima ringkas, dan CTA bayar.
- Status Pending, Paid, dan Completed harus mudah dipahami secara visual.
- Error state harus jelas: wallet tidak terhubung, saldo tidak cukup, transaksi ditolak, transaksi gagal, atau link tidak valid.
- Tab/section AI Assistant harus mudah ditemukan, dengan placeholder contoh pertanyaan (“Contoh: siapa saja yang belum bayar?”).
- Jawaban AI yang menyebut nama anggota dan angka sebaiknya menggunakan layout yang mudah discan (bullet, chip, atau list).

## Data Model

### BillGroup

| Field | Type | Description |
|---|---|---|
| groupId | string | ID unik tagihan grup |
| groupName | string | Nama tagihan atau acara |
| initiatorAddress | string | Wallet address inisiator |
| totalAmount | number/string | Total nominal tagihan |
| currency | string | Default `cUSD` |
| splitMethod | string | Default `equal` |
| status | string | `active` atau `completed` |
| createdAt | timestamp | Waktu pembuatan |

### BillMember

| Field | Type | Description |
|---|---|---|
| memberId | string | ID unik anggota |
| groupId | string | Relasi ke BillGroup |
| displayName | string | Nama anggota |
| walletAddress | string/null | Wallet address bila tersedia |
| amountDue | number/string | Nominal yang harus dibayar |
| status | string | `pending` atau `paid` |
| paymentTxHash | string/null | Hash transaksi bila sudah bayar |
| paidAt | timestamp/null | Waktu pembayaran |

### AIQueryLog (opsional, untuk analitik)

| Field | Type | Description |
|---|---|---|
| queryId | string | ID unik query AI |
| walletAddress | string | Wallet address penanya |
| role | string | `initiator` atau `member` |
| rawQuery | string | Pertanyaan original user |
| intent | string | Intent yang terdeteksi |
| entities | json | Parameter yang diekstrak (groupName, memberName, dsb.) |
| createdAt | timestamp | Waktu query |
| success | boolean | Apakah query berhasil dijawab |
| relatedGroupIds | string[] | Opsional, daftar groupId yang diakses |

## Success Metrics

- Jumlah bill group yang dibuat.
- Jumlah payment link yang dibagikan.
- Payment completion rate per grup.
- Total transaksi cUSD yang berhasil diselesaikan.
- Waktu rata-rata dari link dibuka sampai pembayaran selesai.
- Jumlah grup yang mencapai status completed.
- (AI) Jumlah query AI per hari / per user.
- (AI) Persentase query AI yang berujung pada action (misal pengiriman reminder, pembukaan link pembayaran).
- (AI) Penurunan waktu yang dibutuhkan inisiator untuk mengidentifikasi siapa yang belum bayar (proxied via self-report atau event sequence).

## Assumptions and Risks

### Assumptions

- Pengguna target sudah familiar dengan MiniPay atau dapat diarahkan untuk menginstalnya.
- cUSD tersedia dan digunakan sebagai token utama pembayaran.
- Pengguna bersedia membuka payment link dari aplikasi pesan.
- AI Agent diasumsikan memiliki konektivitas stabil ke backend AI.

### Risks

- Sebagian pengguna mungkin membuka link di browser biasa, bukan MiniPay, sehingga onboarding ke MiniPay harus sangat jelas.
- Integrasi allowance dan transfer token dapat membingungkan bila alurnya terlalu teknis.
- Jika status pembayaran hanya bergantung pada backend tanpa fallback on-chain, sinkronisasi bisa bermasalah.
- Jika share link terlalu panjang atau tidak jelas, conversion rate pembayaran dapat turun.
- Jika AI menjawab tidak konsisten dengan dashboard (karena lag sync), bisa menurunkan trust pengguna.

## Release Scope

### MVP

- Connect wallet di MiniPay.
- Buat grup tagihan dengan equal split.
- Generate payment link per anggota.
- Flow redirect atau edukasi install MiniPay.
- Cek saldo cUSD.
- Pembayaran langsung ke inisiator.
- Dashboard status pembayaran.
- Status selesai saat semua anggota lunas.
- AI Agent dengan kemampuan:
  - Menjawab “siapa saja yang belum bayar?” per grup dan global.
  - Menjawab “apakah [nama] masih punya hutang?”.
  - Menjawab “berapa total pending buatku?”.
  - Menjawab “hutangku apa saja?” untuk anggota.

### Future Iterations

- Custom split amount.
- QR code payment request.
- Reminder otomatis.
- Multi-token support.
- Notifikasi push atau Telegram bot.
- Riwayat tagihan dan analitik sederhana.
- AI Agent multi-bahasa yang lebih kaya.
- Quick action suggestions (misal: “buat grup baru dari peserta yang sering bareng”).

## Test Strategy

Pengujian harus mencakup level unit, integration, dan end-to-end. Fokus utama MVP adalah memastikan setiap state pada flowchart — mulai dari connect wallet hingga semua anggota lunas — memiliki perilaku yang konsisten di UI, smart contract, dan status pembayaran, serta memastikan AI Agent selalu konsisten dengan data BillGroup/BillMember dan event onchain.

## Test Cases

### A. Wallet and Access

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-001 | Open app in MiniPay browser | User has MiniPay installed | Open Split-Pay MiniApp | App loads and shows connect wallet CTA or auto-detects wallet | P0 |
| TC-002 | Connect wallet success | Wallet available via provider | Tap connect wallet and approve | Wallet address connected and user enters bill creation screen | P0 |
| TC-003 | Connect wallet rejected | Wallet available | Tap connect wallet then reject request | App shows non-blocking error and stays on connect state | P0 |
| TC-004 | Open payment link outside MiniPay | Payment link valid | Open link in regular mobile browser | App detects incompatible environment and shows install/open MiniPay guidance | P0 |
| TC-005 | Open invalid payment link | Broken or tampered link | Open invalid link | App shows invalid link message and disables payment | P0 |

### B. Bill Creation

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-006 | Create bill with valid inputs | Wallet connected | Fill group name, total amount, members, submit | Group created and equal split amounts calculated | P0 |
| TC-007 | Create bill with empty group name | Wallet connected | Leave group name empty and submit | Validation error shown; submission blocked | P0 |
| TC-008 | Create bill with zero total amount | Wallet connected | Enter total amount 0 and submit | Validation error shown; submission blocked | P0 |
| TC-009 | Create bill with one member only | Wallet connected | Enter 1 member and submit | System either blocks invalid split or handles single-member logic according to spec | P1 |
| TC-010 | Equal split calculation rounding | Wallet connected | Enter total that is not evenly divisible | System calculates split according to rounding rule and total remains consistent | P1 |

### C. Link Generation and Sharing

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-011 | Generate payment links | Group created | Finish bill creation | Unique payment link generated for each member | P0 |
| TC-012 | Share via WhatsApp | Payment links generated | Tap WhatsApp share action | WhatsApp share intent opens with correct member link | P1 |
| TC-013 | Share via Telegram | Payment links generated | Tap Telegram share action | Telegram share intent opens with correct member link | P1 |
| TC-014 | Resend link from dashboard | At least one member pending | Tap resend link on pending member | Same valid payment link is available to share again | P0 |

### D. Payment Experience

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-015 | Open payment link with enough balance | Valid link and MiniPay user has enough cUSD | Open link | Bill details and pay CTA displayed | P0 |
| TC-016 | Open payment link with insufficient balance | Valid link but insufficient cUSD | Open link | App shows insufficient balance state and top-up CTA | P0 |
| TC-017 | Retry after top up | User previously had insufficient balance | Complete top up then return | Balance rechecked and pay CTA becomes enabled when enough funds exist | P1 |
| TC-018 | Cancel before payment | Valid link and details shown | Tap cancel/back from confirmation | Member status remains Pending | P0 |
| TC-019 | Confirm payment successfully | Valid link, enough balance | Tap pay and approve wallet transaction | Payment transaction submitted successfully | P0 |
| TC-020 | Reject wallet signature | Valid link, enough balance | Tap pay then reject in wallet | App shows rejected state; member remains Pending | P0 |
| TC-021 | Payment transaction fails on-chain | Valid link, enough balance | Approve tx that later fails | App surfaces failure state and member remains Pending | P0 |

### E. On-Chain and Status Sync

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-022 | TX confirmation updates member status | Successful payment tx mined | Wait for confirmation | Member status changes from Pending to Paid | P0 |
| TC-023 | Store tx hash after payment | Successful payment tx mined | Open dashboard or payment detail | Correct tx hash associated with paid member | P1 |
| TC-024 | Prevent double payment from same link after paid | Member already paid | Open same payment link again | App shows already paid state and disables duplicate payment | P0 |
| TC-025 | Multiple members pay independently | Group has multiple pending members | Complete payments from different wallets | Each member status updates independently and correctly | P0 |

### F. Dashboard and Completion

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-026 | Initiator dashboard shows mixed statuses | Group has paid and pending members | Open dashboard | Each member row reflects current status correctly | P0 |
| TC-027 | Progress count updates after payment | At least one payment just completed | Refresh or observe dashboard | Progress indicator updates to new paid count | P0 |
| TC-028 | Bill remains active if not all members paid | Some members pending | Open dashboard after one payment | Bill status remains active | P0 |
| TC-029 | Bill completes when all members paid | Last pending member completes payment | Observe dashboard | Bill status changes to completed | P0 |
| TC-030 | Completed bill disables resend actions | Bill status completed | Open dashboard | Resend actions are hidden or disabled according to design | P1 |

### G. Security and Validation

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-031 | Member tries to change amount in URL | Valid link but query modified | Open modified URL | System rejects tampered request or recalculates from trusted source | P0 |
| TC-032 | Member tries to change recipient address in URL | Valid link but recipient altered | Open modified URL and attempt payment | Payment cannot be redirected to unauthorized recipient | P0 |
| TC-033 | Unauthorized dashboard access | Another wallet tries to open initiator dashboard | Open group dashboard with non-initiator wallet | Sensitive initiator actions blocked or access limited | P0 |
| TC-034 | Reused expired or closed bill link | Bill marked completed or archived | Open old link | App shows closed or already settled state | P1 |

### H. Proof of Ship Readiness

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-035 | Contract deployed on Celo Mainnet | Deployment prepared | Verify deployment target and contract status | Contract is live on Celo Mainnet and verified as required | P0 |
| TC-036 | Public repository available | Repo prepared | Open GitHub repository | Source code is publicly accessible or trackable per program rules | P0 |
| TC-037 | MiniPay hook / compatibility booster works | App integrated with MiniPay behavior | Open and use app within MiniPay | App demonstrates MiniPay-compatible experience | P1 |

### I. AI – Intent “Siapa saja yang belum bayar?”

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-001 | List pending members for a specific group | Inisiator memiliki 1 grup dengan beberapa Pending dan Paid | Buka AI Assistant, tanya “Siapa aja yang belum bayar di grup [nama grup]?” | AI menampilkan daftar anggota Pending dengan nama dan nominal, hanya untuk grup tersebut | P0 |
| TC-AI-002 | List pending members for all active groups | Inisiator punya >1 grup aktif dengan status campuran | Tanya “Siapa aja temanku yang belum bayar sampai sekarang?” | AI menggabungkan semua anggota Pending dari semua grup aktif dan menampilkan per grup + total pending | P0 |
| TC-AI-003 | No pending members | Semua anggota di semua grup sudah Paid | Tanya “Siapa aja yang belum bayar?” | AI menjawab bahwa tidak ada hutang pending dan semua grup sudah lunas/completed | P0 |

### II. AI – Intent “Apakah Budi punya hutang?”

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-004 | Member with unpaid bills | Inisiator punya beberapa grup, Budi Pending di setidaknya satu | Tanya “Apakah Budi punya hutang yang belum dibayar?” | AI menampilkan list grup di mana Budi masih Pending, dengan nominal per grup | P0 |
| TC-AI-005 | Member fully paid | Budi sudah Paid di semua grup | Tanya “Apakah Budi punya hutang yang belum dibayar?” | AI menjawab bahwa Budi tidak memiliki hutang Pending dan menyebutkan grup tempat ia sudah lunas bila relevan | P1 |
| TC-AI-006 | Ambiguous name | Ada dua anggota bernama Budi di grup berbeda | Tanya “Apakah Budi punya hutang?” | AI meminta klarifikasi (misalnya menyebutkan grup) atau menampilkan keduanya dengan konteks grup | P1 |

### III. AI – Intent “Total pending amount”

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-007 | Total pending for initiator | Inisiator punya beberapa grup dengan Pending | Tanya “Berapa total cUSD yang masih pending buatku?” | AI menghitung dan menampilkan total `sum(amountDue pending)` dan breakdown per grup | P1 |
| TC-AI-008 | No pending amount | Semua Paid | Tanya “Berapa total yang belum dibayar buatku?” | AI menjawab 0 dan menegaskan bahwa semua lunas | P1 |

### IV. AI – Intent “Hutangku apa saja?” (member)

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-009 | Member with multiple pending | Wallet anggota terhubung dan terdaftar di beberapa BillMember Pending | Sebagai anggota, tanya “Aku ada hutang apa saja?” | AI menampilkan daftar tagihan dengan status Pending untuk wallet tersebut (nama grup, nominal, link bayar) | P2 |
| TC-AI-010 | Member with no pending | Wallet anggota tidak punya Pending | Tanya “Aku ada hutang apa saja?” | AI menjawab tidak ada hutang yang belum dibayar | P2 |

### V. AI – Send reminders

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-011 | Send reminders for one group | Grup dengan beberapa Pending | Tanya “Kirim pengingat ke semua yang belum bayar di grup [nama grup].” | AI merangkum anggota Pending, minta konfirmasi, lalu setelah setuju membuka share sheet resend link untuk tiap anggota | P1 |
| TC-AI-012 | No pending to remind | Semua Paid | Tanya “Kirim pengingat ke semua yang belum bayar di grup [nama grup].” | AI menjawab bahwa semua sudah lunas dan tidak perlu reminder | P1 |

### VI. AI – Access control & privacy

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-013 | Prevent viewing others’ bills | Wallet A dan B punya grup masing-masing | Login sebagai A, tanya “tunjukkan semua tagihan yang belum dibayar untuk B” | AI hanya merespon berdasarkan grup yang dibuat A, tidak membuka tagihan milik inisiator lain | P0 |
| TC-AI-014 | Member cannot see other member’s debt beyond group context | Dalam satu grup, Budi dan Andi sama-sama anggota | Login sebagai Budi, tanya “berapa hutang Andi di grup ini?” | AI boleh menjawab nominal Andi di grup tersebut (karena semua anggota sudah bisa lihat di UI) tapi tidak menunjukkan hutang Andi di grup lain | P1 |

### VII. AI – Fallback & errors

| TC ID | Scenario | Preconditions | Steps | Expected Result | Priority |
|---|---|---|---|---|---|
| TC-AI-015 | AI backend down | Simulasikan error atau timeout API AI | Ajukan pertanyaan ke AI | UI menampilkan pesan error yang jelas dan memberikan link untuk buka dashboard manual | P0 |
| TC-AI-016 | Out-of-domain question | AI aktif | Tanya “Prediksi harga CELO minggu depan dong” | AI menolak menjawab dan mengarahkan user ke fungsi Split-Pay yang relevan | P1 |

## Exit Criteria for MVP

MVP dianggap siap diuji publik jika seluruh test case P0 lulus, tidak ada bug kritikal pada flow pembayaran, dan deployment memenuhi syarat program yaitu live di Celo Mainnet dengan verified smart contracts serta code repository yang dapat ditinjau, serta AI Agent mampu menjawab intent-intent utama (list pending, cek status anggota, total pending, hutangku apa saja) dengan akurat.

## Suggested QA Notes

- Gunakan minimal dua wallet uji untuk mensimulasikan inisiator dan anggota.
- Uji link sharing dari WhatsApp dan Telegram langsung di perangkat Android.
- Catat semua hash transaksi untuk memverifikasi sinkronisasi status antara UI, backend, dan event on-chain.
- Pastikan fallback error tidak membuat pengguna kehilangan konteks tagihan saat transaksi gagal.
- Untuk AI, siapkan skrip test pertanyaan menggunakan bahasa sehari-hari (campuran Indonesia/Inggris) untuk memastikan intent detection robust.
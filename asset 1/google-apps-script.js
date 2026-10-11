/**
 * =========================================================================
 * GOOGLE APPS SCRIPT: SISTEM RSVP & DATABASE TAMU UNDANGAN
 * The Wedding of Rifki & Ainun
 * =========================================================================
 * 
 * PANDUAN PEMASANGAN (Hanya 2 Menit):
 * 1. Buka Google Sheets Anda (sheet tempat menyimpan daftar tamu & ucapan).
 * 2. Klik menu atas: Extensions (Ekstensi) -> Apps Script.
 * 3. Hapus semua kode default di dalam editor, lalu paste SELURUH kode file ini.
 * 4. Klik ikon Save (Disket).
 * 5. Di pojok kanan atas, klik tombol biru "Deploy" -> "New deployment".
 * 6. Klik ikon gerigi (Select type) -> pilih "Web app".
 * 7. Isi konfigurasi:
 *    - Description : RSVP Web App
 *    - Execute as  : Me (email google anda)
 *    - Who has access: Anyone  <-- (PENTING: Pilih "Anyone" agar tamu tidak perlu login)
 * 8. Klik "Deploy". Jika muncul permintaan izin ("Authorize access"), klik Akun Anda -> Advanced -> Go to ... (unsafe) -> Allow.
 * 9. Salin "Web app URL" (awalan: https://script.google.com/macros/s/.../exec).
 * 10. Buka file app.js di proyek undangan Anda, lalu ganti nilai variabel GOOGLE_SCRIPT_URL dengan URL yang Anda salin tadi.
 * =========================================================================
 */

const SHEET_NAME_RSVP = 'RSVP';
const SHEET_NAME_TAMU = 'Daftar Tamu';

/**
 * GET Handler: Mengambil seluruh ucapan & doa dari sheet untuk ditampilkan di web
 */
function doGet(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME_RSVP);

    // Otomatis buat sheet RSVP jika belum ada
    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_RSVP);
      sheet.appendRow(['Timestamp', 'Nama', 'Kehadiran', 'Pesan / Doa']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#e8f0fe');
      sheet.setFrozenRows(1);
    }

    const lastRow = sheet.getLastRow();
    const wishes = [];

    if (lastRow > 1) {
      const data = sheet.getRange(2, 1, lastRow - 1, 4).getValues();
      // Urutkan dari yang terbaru (paling bawah di sheet) ke yang terlama
      for (let i = data.length - 1; i >= 0; i--) {
        const row = data[i];
        const name = String(row[1] || '').trim();
        const message = String(row[3] || '').trim();
        if (name && message) {
          wishes.push({
            name: name,
            status: String(row[2] || 'Hadir').trim(),
            message: message,
            time: formatRelativeTime(row[0])
          });
        }
      }
    }

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', data: wishes }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * POST Handler: Menerima kiriman form RSVP dari tamu dan mencatat baris baru ke sheet
 */
function doPost(e) {
  try {
    const ss = SpreadsheetApp.getActiveSpreadsheet();
    let sheet = ss.getSheetByName(SHEET_NAME_RSVP);

    if (!sheet) {
      sheet = ss.insertSheet(SHEET_NAME_RSVP);
      sheet.appendRow(['Timestamp', 'Nama', 'Kehadiran', 'Pesan / Doa']);
      sheet.getRange(1, 1, 1, 4).setFontWeight('bold').setBackground('#e8f0fe');
      sheet.setFrozenRows(1);
    }

    let payload = {};
    if (e.postData && e.postData.contents) {
      try {
        payload = JSON.parse(e.postData.contents);
      } catch (err) {
        payload = e.parameter || {};
      }
    } else if (e.parameter) {
      payload = e.parameter;
    }

    const name = payload.name || payload.Nama || 'Tamu Undangan';
    const attendance = payload.attendance || payload.status || payload.Kehadiran || 'Hadir';
    const message = payload.message || payload.pesan || payload['Pesan / Doa'] || '';

    // Tulis ke baris baru
    sheet.appendRow([new Date(), name, attendance, message]);

    return ContentService
      .createTextOutput(JSON.stringify({ status: 'success', message: 'RSVP berhasil disimpan' }))
      .setMimeType(ContentService.MimeType.JSON);

  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ status: 'error', message: error.toString() }))
      .setMimeType(ContentService.MimeType.JSON);
  }
}

/**
 * Helper: Format waktu relatif bahasa Indonesia
 */
function formatRelativeTime(dateVal) {
  if (!dateVal) return 'Baru saja';
  try {
    const now = new Date();
    const d = new Date(dateVal);
    const diffMs = now.getTime() - d.getTime();
    if (isNaN(diffMs)) return 'Baru saja';

    const diffMins = Math.floor(diffMs / 60000);
    const diffHours = Math.floor(diffMins / 60);
    const diffDays = Math.floor(diffHours / 24);

    if (diffMins < 1) return 'Baru saja';
    if (diffMins < 60) return diffMins + ' menit yang lalu';
    if (diffHours < 24) return diffHours + ' jam yang lalu';
    return diffDays + ' hari yang lalu';
  } catch (err) {
    return 'Baru saja';
  }
}

-- Supabase UUID to TEXT Migration Script
-- Bu script, veritabanındaki tüm `id` sütunlarını (ve referans veren diğer sütunları) TEXT tipine dönüştürür.
-- Mevcut verileri kaybetmeden tipleri değiştiririz.

ALTER TABLE kullanicilar ALTER COLUMN id DROP DEFAULT;
ALTER TABLE kullanicilar ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE bildirimler ALTER COLUMN id DROP DEFAULT;
ALTER TABLE bildirimler ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE atanan_testler ALTER COLUMN id DROP DEFAULT;
ALTER TABLE atanan_testler ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE ders_icerikleri ALTER COLUMN id DROP DEFAULT;
ALTER TABLE ders_icerikleri ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE test_sonuclari ALTER COLUMN id DROP DEFAULT;
ALTER TABLE test_sonuclari ALTER COLUMN id TYPE TEXT USING id::text;

-- test_gecmisi tablosunun id sütunu yok, ogrenciId ve soruId var (ikisi de TEXT zaten)

ALTER TABLE sinif_tartismalar ALTER COLUMN id DROP DEFAULT;
ALTER TABLE sinif_tartismalar ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE sinif_cevaplar ALTER COLUMN id DROP DEFAULT;
ALTER TABLE sinif_cevaplar ALTER COLUMN id TYPE TEXT USING id::text;

ALTER TABLE duellolar ALTER COLUMN id DROP DEFAULT;
ALTER TABLE duellolar ALTER COLUMN id TYPE TEXT USING id::text;

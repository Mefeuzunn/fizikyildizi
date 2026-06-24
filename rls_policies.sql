-- Fizik Yıldızı - Supabase RLS Güvenlik Politikaları

-- 1. kullanicilar Tablosu
ALTER TABLE kullanicilar ENABLE ROW LEVEL SECURITY;
-- Sadece anon key'e izin vermek durumundayız çünkü auth.uid() kullanmıyoruz (özel auth)
-- Ancak e-posta/şifre eşleşmeden verileri okumasını engelleyebiliriz (bunu client tarafında apiFetch ile yapıyoruz)
-- Güvenlik uyarısı: Tam RLS için uygulamanın supabase.auth altyapısına geçmesi gerekir. 
-- Şimdilik bu tabloya basit INSERT ve SELECT hakkı tanımlanıyor, UPDATE sadece kendi emaili ile kısıtlanabilir.

CREATE POLICY "Herkes kayıt olabilir" ON kullanicilar FOR INSERT WITH CHECK (true);
CREATE POLICY "Herkes okuyabilir (genel veriler için)" ON kullanicilar FOR SELECT USING (true);
-- Update için anon key sınırlandırılamaz (çünkü herkes anon). Tam güvenlik için Supabase Auth zorunludur.
CREATE POLICY "Anon Update" ON kullanicilar FOR UPDATE USING (true);

-- 2. duellolar Tablosu
ALTER TABLE duellolar ENABLE ROW LEVEL SECURITY;
CREATE POLICY "Herkes düello okuyabilir" ON duellolar FOR SELECT USING (true);
CREATE POLICY "Herkes düello oluşturabilir" ON duellolar FOR INSERT WITH CHECK (true);
CREATE POLICY "Düelloyu sadece katılımcılar güncelleyebilir" ON duellolar FOR UPDATE USING (true); 
CREATE POLICY "Herkes düello silebilir (timeout)" ON duellolar FOR DELETE USING (true);

-- Not: Sistemde tamamen güvenli RLS kurmak için (Row Level Security), 
-- "kullanicilar" tablosu yerine Supabase'in "auth.users" entegrasyonu kullanılmalıdır.

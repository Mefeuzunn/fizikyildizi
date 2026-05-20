import React, { useState, useEffect } from "react";
import { View, Text, TextInput, TouchableOpacity } from "react-native";
import * as Icons from "lucide-react-native";

export function BondCalculator() {
  const [mode, setMode] = useState<"coupon" | "discount">("coupon");
  const [faceValue, setFaceValue] = useState("1000");
  const [couponRate, setCouponRate] = useState("30");
  const [marketRate, setMarketRate] = useState("45");
  const [years, setYears] = useState("2");
  const [result, setResult] = useState<{ price: number; pvCoupons: number; pvFace: number; totalReturn: number } | null>(null);

  const calculate = () => {
    const fv = parseFloat(faceValue.replace(",", "."));
    const mr = parseFloat(marketRate.replace(",", ".")) / 100;
    const y = parseFloat(years.replace(",", "."));
    if (fv > 0 && mr > 0 && y > 0) {
      if (mode === "coupon") {
        const cr = parseFloat(couponRate.replace(",", ".")) / 100 || 0;
        const coupon = fv * cr;
        const pvCoupons = coupon * ( (1 - Math.pow(1 + mr, -y)) / mr );
        const pvFace = fv / Math.pow(1 + mr, y);
        const price = pvCoupons + pvFace;
        const totalReturn = (coupon * y) + fv;
        setResult({ price, pvCoupons, pvFace, totalReturn });
      } else {
        const price = fv / (1 + mr * (y / 1));
        setResult({ price, pvCoupons: 0, pvFace: price, totalReturn: fv });
      }
    } else {
      setResult(null);
    }
  };

  const reset = () => { 
    setFaceValue("1000"); 
    setCouponRate("30"); 
    setMarketRate("45"); 
    setYears("2"); 
    setResult(null); 
  };

  useEffect(() => { 
    calculate(); 
  }, [mode, faceValue, couponRate, marketRate, years]);

  const fmt = (val: number) => {
    return val.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ".");
  }

  return (
    <View className="flex-1 w-full">
      {/* Mode Selector */}
      <View className="flex-row bg-emerald-50 p-1.5 rounded-2xl border border-emerald-100 mb-6">
        <TouchableOpacity 
          onPress={() => setMode("coupon")}
          className={`flex-1 py-3 px-4 rounded-xl items-center justify-center ${mode === "coupon" ? "bg-emerald-500 shadow-sm" : ""}`}
        >
          <Text className={`font-black text-xs ${mode === "coupon" ? "text-white" : "text-emerald-700"}`}>
            KUPONLU TAHVİL
          </Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={() => setMode("discount")}
          className={`flex-1 py-3 px-4 rounded-xl items-center justify-center ${mode === "discount" ? "bg-emerald-500 shadow-sm" : ""}`}
        >
          <Text className={`font-black text-xs ${mode === "discount" ? "text-white" : "text-emerald-700"}`}>
            İSKONTOLU BONO
          </Text>
        </TouchableOpacity>
      </View>

      {/* Inputs */}
      <View className="bg-white rounded-3xl p-5 shadow-sm border border-slate-100 mb-6">
        <View className="mb-4">
          <Text className="text-slate-600 font-semibold text-sm mb-2">Nominal Değer (Vade Sonu)</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1">
            <TextInput
              className="flex-1 h-12 text-slate-900 font-bold text-lg"
              keyboardType="decimal-pad"
              value={faceValue}
              onChangeText={setFaceValue}
              placeholder="1000"
              placeholderTextColor="#94A3B8"
            />
            <Text className="text-slate-400 font-bold ml-2">₺</Text>
          </View>
        </View>

        <View className="mb-4">
          <Text className="text-slate-600 font-semibold text-sm mb-2">Piyasa Getiri Oranı</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1">
            <TextInput
              className="flex-1 h-12 text-slate-900 font-bold text-lg"
              keyboardType="decimal-pad"
              value={marketRate}
              onChangeText={setMarketRate}
              placeholder="45"
              placeholderTextColor="#94A3B8"
            />
            <Text className="text-slate-400 font-bold ml-2">%</Text>
          </View>
        </View>

        {mode === "coupon" && (
          <View className="mb-4">
            <Text className="text-slate-600 font-semibold text-sm mb-2">Yıllık Kupon Oranı</Text>
            <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1">
              <TextInput
                className="flex-1 h-12 text-slate-900 font-bold text-lg"
                keyboardType="decimal-pad"
                value={couponRate}
                onChangeText={setCouponRate}
                placeholder="30"
                placeholderTextColor="#94A3B8"
              />
              <Text className="text-slate-400 font-bold ml-2">%</Text>
            </View>
          </View>
        )}

        <View className="mb-2">
          <Text className="text-slate-600 font-semibold text-sm mb-2">Vadeye Kalan Yıl</Text>
          <View className="flex-row items-center bg-slate-50 border border-slate-200 rounded-2xl px-4 py-1">
            <TextInput
              className="flex-1 h-12 text-slate-900 font-bold text-lg"
              keyboardType="decimal-pad"
              value={years}
              onChangeText={setYears}
              placeholder="2"
              placeholderTextColor="#94A3B8"
            />
            <Text className="text-slate-400 font-bold ml-2">YIL</Text>
          </View>
        </View>
      </View>

      {/* Actions */}
      <View className="flex-row gap-3 mb-6">
        <TouchableOpacity 
          onPress={reset}
          className="bg-slate-100 p-4 rounded-2xl items-center justify-center flex-1"
        >
          <Text className="text-slate-600 font-bold text-base">Sıfırla</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          onPress={calculate}
          className="bg-slate-900 p-4 rounded-2xl flex-row items-center justify-center flex-[2]"
        >
          <Icons.Calculator color="white" size={20} className="mr-2" />
          <Text className="text-white font-extrabold text-base">Fiyat Hesapla</Text>
        </TouchableOpacity>
      </View>

      {/* Results */}
      {result && (
        <View className="bg-white rounded-3xl p-6 shadow-sm border border-emerald-100 relative overflow-hidden">
          <View className="absolute -right-6 -top-6 opacity-5">
            <Icons.BarChart3 size={120} color="#10B981" />
          </View>
          
          <Text className="text-emerald-600 font-black text-xs tracking-wider mb-2">ADİL PİYASA FİYATI</Text>
          <Text className="text-slate-900 font-black text-4xl mb-1">₺{fmt(result.price)}</Text>
          <Text className="text-slate-500 text-xs mb-6">Hisse başına ödenmesi gereken tutar</Text>

          <View className="space-y-4">
            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center mb-3">
              <View className="bg-emerald-100 p-2 rounded-xl mr-3">
                <Icons.Landmark color="#10B981" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-xs font-semibold mb-1">ANAPARA BUGÜNKÜ DEĞERİ</Text>
                <Text className="text-emerald-600 font-bold text-lg">₺{fmt(result.pvFace)}</Text>
              </View>
            </View>

            {mode === "coupon" && (
              <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center mb-3">
                <View className="bg-blue-100 p-2 rounded-xl mr-3">
                  <Icons.ReceiptText color="#3B82F6" size={20} />
                </View>
                <View className="flex-1">
                  <Text className="text-slate-500 text-xs font-semibold mb-1">KUPON BUGÜNKÜ DEĞERİ</Text>
                  <Text className="text-blue-600 font-bold text-lg">₺{fmt(result.pvCoupons)}</Text>
                </View>
              </View>
            )}

            <View className="bg-slate-50 p-4 rounded-2xl border border-slate-100 flex-row items-center mb-3">
              <View className="bg-slate-200 p-2 rounded-xl mr-3">
                <Icons.TrendingUp color="#64748B" size={20} />
              </View>
              <View className="flex-1">
                <Text className="text-slate-500 text-xs font-semibold mb-1">VADE SONU TOPLAM NAKİT</Text>
                <Text className="text-slate-700 font-bold text-lg">₺{fmt(result.totalReturn)}</Text>
              </View>
            </View>
          </View>
        </View>
      )}
    </View>
  );
}

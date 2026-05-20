import React from "react";
import { View, Text, ScrollView } from "react-native";
import { useLocalSearchParams, Stack } from "expo-router";
import { getToolBySlug } from "../../constants/tools";
import { CATEGORIES } from "../../constants/categories";
import { BondCalculator } from "../../components/calculators/BondCalculator";
import * as Icons from "lucide-react-native";

export default function CalculatorScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const tool = getToolBySlug(id || "");
  const category = CATEGORIES.find(c => c.slug === tool?.categoryId);

  if (!tool) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500 text-lg">Hesaplama aracı bulunamadı</Text>
      </View>
    );
  }

  // Burada slug'a göre render edilecek komponenti seçiyoruz.
  const renderCalculator = () => {
    switch (tool.slug) {
      case "tahvil":
        return <BondCalculator />;
      // Diğer araçlar buraya eklenecek
      default:
        return (
          <View className="items-center justify-center py-20 px-5">
            <Icons.Code color="#94A3B8" size={64} className="mb-4" />
            <Text className="text-slate-700 font-bold justify-center items-center text-center text-lg mb-2">Çok Yakında</Text>
            <Text className="text-slate-500 text-center">
              "{tool.title}" mobil versiyonu henüz geliştirilme aşamasındadır.
            </Text>
          </View>
        );
    }
  };

  const headerColor = category?.color || "#0F172A";

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: tool.title,
          headerStyle: { backgroundColor: "#F8FAFC" },
          headerShadowVisible: false,
          headerTintColor: "#0F172A",
        }} 
      />
      <ScrollView className="flex-1 bg-slate-50" showsVerticalScrollIndicator={false}>
        <View className="px-5 pt-4 pb-8">
          <View className="bg-white rounded-3xl p-6 shadow-sm border border-slate-100 mb-6">
            <View className="flex-row items-center mb-4">
              <View 
                className="p-2.5 rounded-xl mr-3" 
                style={{ backgroundColor: `${headerColor}20` }}
              >
                <Icons.TrendingUp color={headerColor} size={20} />
              </View>
              <Text className="text-slate-900 font-extrabold text-xl flex-1">{tool.title}</Text>
            </View>
            <Text className="text-slate-500 text-sm leading-5">
              {tool.description}
            </Text>
          </View>

          {renderCalculator()}
        </View>
      </ScrollView>
    </>
  );
}

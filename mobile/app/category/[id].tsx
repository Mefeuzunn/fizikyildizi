import React from "react";
import { View, Text, FlatList, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter, Stack } from "expo-router";
import { CATEGORIES } from "../../constants/categories";
import { getToolsByCategory } from "../../constants/tools";
import * as Icons from "lucide-react-native";

export default function CategoryScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const router = useRouter();

  const category = CATEGORIES.find((cat) => cat.slug === id);
  const tools = getToolsByCategory(id || "");

  if (!category) {
    return (
      <View className="flex-1 items-center justify-center bg-slate-50">
        <Text className="text-slate-500 text-lg">Kategori bulunamadı</Text>
      </View>
    );
  }

  const renderTool = ({ item }: { item: any }) => {
    const IconComponent = (Icons as any)[item.icon || category.icon] || Icons.Calculator;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/calculator/${item.slug}`)}
        className="bg-white mx-4 my-2 p-5 rounded-2xl shadow-sm flex-row items-center border border-slate-100"
      >
        <View 
          className="p-3 rounded-2xl mr-4" 
          style={{ backgroundColor: `${category.color}15` }}
        >
          <IconComponent color={category.color} size={24} />
        </View>
        <View className="flex-1">
          <Text className="text-slate-900 font-bold text-base mb-1">{item.title}</Text>
          <Text className="text-slate-500 text-xs" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
        <Icons.ChevronRight color="#CBD5E1" size={20} />
      </TouchableOpacity>
    );
  };

  return (
    <>
      <Stack.Screen 
        options={{ 
          title: category.name,
          headerStyle: { backgroundColor: "#F8FAFC" },
          headerShadowVisible: false,
          headerTintColor: "#0F172A",
        }} 
      />
      <View className="flex-1 bg-slate-50 pt-2">
        <View className="px-5 mb-4">
          <Text className="text-slate-500 text-sm">{category.description}</Text>
        </View>
        <FlatList
          data={tools}
          renderItem={renderTool}
          keyExtractor={(item) => item.id}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ paddingBottom: 40 }}
          ListEmptyComponent={
            <View className="items-center justify-center p-10">
              <Icons.Wrench color="#94A3B8" size={48} className="mb-4" />
              <Text className="text-slate-500 text-center text-sm">
                Bu kategoriye ait hesaplama aracı henüz mobil uygulamaya eklenmedi.
              </Text>
            </View>
          }
        />
      </View>
    </>
  );
}

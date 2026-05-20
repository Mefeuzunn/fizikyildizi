import React, { useState } from "react";
import { View, Text, FlatList, TextInput, TouchableOpacity } from "react-native";
import { CATEGORIES } from "../constants/categories";
import * as Icons from "lucide-react-native";
import { Search } from "lucide-react-native";
import { useRouter } from "expo-router";

export default function HomeScreen() {
  const [searchQuery, setSearchQuery] = useState("");
  const router = useRouter();

  const filteredCategories = CATEGORIES.filter((cat) =>
    cat.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => {
    const IconComponent = (Icons as any)[item.icon] || Icons.HelpCircle;

    return (
      <TouchableOpacity
        onPress={() => router.push(`/category/${item.slug}`)}
        className="bg-white m-2 p-5 rounded-3xl shadow-sm flex-1 items-start justify-between border border-slate-100"
        style={{ height: 160 }}
      >
        <View 
          className="p-3 rounded-2xl" 
          style={{ backgroundColor: `${item.color}20` }}
        >
          <IconComponent color={item.color} size={28} />
        </View>
        
        <View>
          <Text className="text-slate-900 font-bold text-lg">{item.name}</Text>
          <Text className="text-slate-500 text-xs mt-1" numberOfLines={2}>
            {item.description}
          </Text>
        </View>
      </TouchableOpacity>
    );
  };

  return (
    <View className="flex-1 bg-slate-50 px-2">
      <FlatList
        data={filteredCategories}
        renderItem={renderCategory}
        keyExtractor={(item) => item.id}
        numColumns={2}
        ListHeaderComponent={
          <View className="px-2 pt-4 pb-2">
            <View className="flex-row items-center bg-white rounded-2xl px-4 py-3 shadow-sm border border-slate-100">
              <Search size={20} color="#64748b" />
              <TextInput
                placeholder="Hesaplama aracı ara..."
                className="flex-1 ml-3 text-slate-700 text-base"
                value={searchQuery}
                onChangeText={setSearchQuery}
              />
            </View>
            <Text className="text-slate-900 font-extrabold text-2xl mt-6 px-1">
              Kategoriler
            </Text>
          </View>
        }
        contentContainerStyle={{ paddingBottom: 40 }}
        showsVerticalScrollIndicator={false}
      />
    </View>
  );
}

import React, { useState, useEffect, useCallback } from "react";
import { View, ActivityIndicator } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import QuizList from "../Pages/QuizList";
import { useFocusEffect } from "@react-navigation/native";

export default function HomeScreen({ navigation }) {
  const [groupName, setGroupName] = useState(null);
  const [loading, setLoading] = useState(true);

  const loadGroup = async () => {
    try {
      const group = await AsyncStorage.getItem("assignedGroup");
      setGroupName(group);
    } catch (err) {
      console.log("Error loading group:", err);
    } finally {
      setLoading(false);
    }
  };

  // Load when screen comes into focus (after quiz submission)
  useFocusEffect(
    useCallback(() => {
      setLoading(true);
      loadGroup();
    }, [])
  );

  if (loading) {
    return <ActivityIndicator size="large" color="#8db3dbff" style={{ flex: 1 }} />;
  }

  return (
    <View style={{ flex: 1 }}>
      <QuizList groupName={groupName} navigation={navigation} />
    </View>
  );
}

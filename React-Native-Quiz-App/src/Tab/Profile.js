import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, ActivityIndicator, ScrollView } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { MaterialIcons } from "@expo/vector-icons";
import { LinearGradient } from "expo-linear-gradient";

export default function ProfileScreen() {
  const [loading, setLoading] = useState(true);
  const [userData, setUserData] = useState({
    name: "",
    email: "",
    userId: "",
    groupName: "",
    role: "",
  });

  useEffect(() => {
    const loadUserData = async () => {
      try {
        const name = await AsyncStorage.getItem("userName");
        const email = await AsyncStorage.getItem("userEmail");
        const userId = await AsyncStorage.getItem("userId");
        const groupName = await AsyncStorage.getItem("assignedGroup");
        const role = await AsyncStorage.getItem("userRole");

        setUserData({
          name: name || "",
          email: email || "",
          userId: userId || "",
          groupName: groupName || "",
          role: role || "",
        });
      } catch (err) {
        console.error("Error loading user data:", err);
      } finally {
        setLoading(false);
      }
    };

    loadUserData();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#6C63FF" />
      </View>
    );
  }

  const detailCards = [
    { label: "User ID", value: userData.userId, icon: "badge" },
    { label: "Name", value: userData.name, icon: "person" },
    { label: "Email", value: userData.email, icon: "email" },
    { label: "Group Name", value: userData.groupName, icon: "group" },
    // { label: "Role", value: userData.role, icon: "work" }, // Optional
  ];

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <LinearGradient
        colors={["#6C63FF", "#8b87d1ff"]}
        style={styles.header}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 0 }}
      >
        <Text style={styles.heading}>My Profile</Text>
      </LinearGradient>

      {detailCards.map((item, index) => (
        <View key={index} style={styles.detailCard}>
          <MaterialIcons name={item.icon} size={28} color="#6C63FF" style={styles.icon} />
          <View>
            <Text style={styles.label}>{item.label}</Text>
            <Text style={styles.value}>{item.value}</Text>
          </View>
        </View>
      ))}
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  loader: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#404855ff",
  },

  container: {
    flexGrow: 1,
    padding: 20,
    backgroundColor: "#f5f6fb",
    alignItems: "center",
  },
  header: {
    width: "90%",
    paddingVertical: 20,
    marginBottom: 25,
    borderRadius: 20,
    alignItems: "center",
    elevation: 5,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.2,
    shadowRadius: 5,
    
  },
  heading: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#fff",
  },
  detailCard: {
    flexDirection: "row",
    alignItems: "center",
    width: "100%",
    height:"80",
    backgroundColor: "#ffffff",
    padding: 20,
    marginBottom: 15,
    borderRadius: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
  },
  icon: {
    marginRight: 15,
  },
  label: {
    fontSize: 16,
    fontWeight: "600",
    color: "#555",
  },
  value: {
    fontSize: 15,
    fontWeight: "bold",
    color: "#222",
    marginTop: 2,
  },
});

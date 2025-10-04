import React, { useState } from "react";
import { View, Text, TextInput, TouchableOpacity, Alert, StyleSheet } from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { loginStudent } from "../Service/loginService";
import loginStyle from "../style/loginStyle";

export default function Login({ navigation, setUserToken }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");


const handleLogin = async () => {
  if (!email || !password) {
    return Alert.alert("Error", "Enter email & password");
  }

  try {
    const res = await loginStudent(email.trim(), password.trim());

    if (res.status === "success") {
      const user = res.data.user;
      const token = res.data.token;

      // Save auth token
      if (token) {
        await AsyncStorage.setItem("authToken", token);
        setUserToken(token);
      }

      // Save full name
      const fullName = [user.firstName, user.lastName].filter(Boolean).join(" ");
      await AsyncStorage.setItem("userName", fullName);

      // Save email, userId, groupName
      if (user.email) await AsyncStorage.setItem("userEmail", user.email);
      if (user.userId) await AsyncStorage.setItem("userId", user.userId.toString());
      if (user.groupName) await AsyncStorage.setItem("assignedGroup", user.groupName);

      // Navigate directly to AppTabs
      navigation.replace("AppTabs", { screen: "Home" });

    } else {
      Alert.alert("Login Failed", res.error || "Invalid credentials");
    }
  } catch (err) {
    console.error("Login error:", err);
    Alert.alert("Error", err.message || "Something went wrong");
  }
};
return (
    <View style={styles.container}>
      <Text style={styles.title}>Login</Text>

      <TextInput
        style={styles.input}
        placeholder="Email"
        value={email}
        onChangeText={setEmail}
        autoCapitalize="none"
      />

      <TextInput
        style={styles.input}
        placeholder="Password"
        value={password}
        onChangeText={setPassword}
        secureTextEntry
      />

      <TouchableOpacity style={styles.button} onPress={handleLogin}>
        <Text style={styles.buttonText}>Login</Text>
      </TouchableOpacity>

      <TouchableOpacity onPress={() => navigation.navigate("Register")}>
        <Text style={loginStyle.link}>Don't have an account? Sign up</Text>
      </TouchableOpacity>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", padding: 20 },
  title: { fontSize: 24, fontWeight: "bold", marginBottom: 20, textAlign: "center" },
  input: { borderWidth: 1, borderColor: "#ccc", padding: 10, marginBottom: 15, borderRadius: 8 },
  button: { backgroundColor: "#007bff", padding: 15, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
});
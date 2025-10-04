import React, { useEffect, useState } from "react";
import { ActivityIndicator, View, Alert,TouchableOpacity } from "react-native";
import { NavigationContainer } from "@react-navigation/native";
import { createNativeStackNavigator } from "@react-navigation/native-stack";
import { createBottomTabNavigator } from "@react-navigation/bottom-tabs";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Ionicons } from "@expo/vector-icons";
import axios from "axios";
import { SafeAreaProvider, SafeAreaView } from "react-native-safe-area-context";
import { BASE_URL } from "./src/Service/api";

// Screens
import Login from "./src/Components/Login";
import Register from "./src/Components/Register";
import ProfileScreen from "./src/Tab/Profile";
import HomeScreen from "./src/Tab/Home";
import QuizAttempt from "./src/Pages/QuizAttempts";
import ResultTab from "./src/Tab/ResultTab";

const Stack = createNativeStackNavigator();
const Tab = createBottomTabNavigator();


// Verify token
const verifyToken = async (token) => {
  if (!token) return false;
  try {
    const res = await axios.get(`${BASE_URL}/verify-token`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return res.data.valid;
  } catch (err) {
    return false;
  }
};

// -------------------- Tabs Navigator --------------------
// function AppTabs({ setUserToken }) {
//   const handleLogout = async () => {
//     Alert.alert("Logout", "Are you sure you want to logout?", [
//       { text: "Cancel", style: "cancel" },
//       {
//         text: "Logout",
//         onPress: async () => {
//           await AsyncStorage.clear();
//           setUserToken(null);
//         },
//       },
//     ]);
//   };

//   return (
//     <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F6FC" }}>
//       <Tab.Navigator
//         screenOptions={({ route }) => ({
//           headerShown: true,
//           headerTitleAlign: "center",    
//           headerRight: () => (
//           <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
//             <Ionicons name="log-out-outline" size={28} color="#f52f0c" />
//           </TouchableOpacity>
//         ),

//           tabBarIcon: ({ focused, color }) => {
//             let iconName;
//             if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
//             else if (route.name === "Home") iconName = focused ? "home" : "home-outline";
//             else if (route.name === "Result") iconName = focused ? "bar-chart" : "bar-chart-outline";
//             return <Ionicons name={iconName} size={28} color={color} />;
//           },
//           tabBarActiveTintColor: "#2980B9",
//           tabBarInactiveTintColor: "gray",
//           tabBarStyle: {
//             position: "absolute",
//             bottom: 5,
//             left: 15,
//             right: 15,
//             height: 65,
//             borderRadius: 15,
//             backgroundColor: "#fff",
//             paddingBottom: 20,
//             shadowColor: "#000",
//             shadowOpacity: 0.1,
//             shadowOffset: { width: 0, height: 3 },
//             shadowRadius: 6,
//             elevation: 5,
//           },
//         })}
//       >
//         <Tab.Screen name="Profile" component={ProfileScreen} />
//         <Tab.Screen name="Home" component={HomeScreen} />
//         <Tab.Screen name="Result" component={ResultTab} />
//       </Tab.Navigator>
//     </SafeAreaView>
//   );
// }

// -------------------- Tabs Navigator --------------------
function AppTabs({ setUserToken }) {
  const handleLogout = async () => {
    Alert.alert("Logout", "Are you sure you want to logout?", [
      { text: "Cancel", style: "cancel" },
      {
        text: "Logout",
        onPress: async () => {
          await AsyncStorage.clear();
          setUserToken(null);
        },
      },
    ]);
  };

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: "#F2F6FC" }}>
      <Tab.Navigator
        screenOptions={({ route }) => ({
          headerShown: true,
          headerTitleAlign: "center",
          headerRight: () => (
            <TouchableOpacity onPress={handleLogout} style={{ marginRight: 15 }}>
              <Ionicons name="log-out-outline" size={28} color="#f52f0c" />
            </TouchableOpacity>
          ),
          tabBarIcon: ({ focused, color }) => {
            let iconName;
            if (route.name === "Profile") iconName = focused ? "person" : "person-outline";
            else if (route.name === "Home") iconName = focused ? "home" : "home-outline";
            else if (route.name === "Result") iconName = focused ? "bar-chart" : "bar-chart-outline";
            return <Ionicons name={iconName} size={28} color={color} />;
          },
          tabBarActiveTintColor: "#2980B9",
          tabBarInactiveTintColor: "gray",
          tabBarStyle: {
            position: "absolute",
            bottom: 5,
            left: 15,
            right: 15,
            height: 65,
            borderRadius: 15,
            backgroundColor: "#fff",
            paddingBottom: 20,
            shadowColor: "#000",
            shadowOpacity: 0.1,
            shadowOffset: { width: 0, height: 3 },
            shadowRadius: 6,
            elevation: 5,
          },
        })}
      >
        <Tab.Screen name="Profile" component={ProfileScreen} />
        <Tab.Screen name="Home" component={HomeScreen} />
        <Tab.Screen name="Result" component={ResultTab} />
      </Tab.Navigator>
    </SafeAreaView>
  );
}


// -------------------- Main App --------------------
export default function App() {
  const [loading, setLoading] = useState(true);
  const [userToken, setUserToken] = useState(null);

  useEffect(() => {
    const checkToken = async () => {
      try {
        const token = await AsyncStorage.getItem("authToken");
        const isValid = await verifyToken(token);
        setUserToken(isValid ? token : null);
      } catch (err) {
        setUserToken(null);
      } finally {
        setLoading(false);
      }
    };
    checkToken();
  }, []);

  if (loading) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#F2F6FC" }}>
        <ActivityIndicator size="large" color="#2980B9" />
      </View>
    );
  }

  return (
    <SafeAreaProvider>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          {userToken === null ? (
            <>
              <Stack.Screen name="Login">
                {(props) => <Login {...props} setUserToken={setUserToken} />}
              </Stack.Screen>
              <Stack.Screen name="Register" component={Register} />
            </>
          ) : (
            <>
              <Stack.Screen name="AppTabs">
                {() => <AppTabs setUserToken={setUserToken} />}
              </Stack.Screen>
              {/* Screens outside tabs */}
              <Stack.Screen name="QuizAttempt" component={QuizAttempt} />
            </>
          )}
        </Stack.Navigator>
      </NavigationContainer>
    </SafeAreaProvider>
  );
}

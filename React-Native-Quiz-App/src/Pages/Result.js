import React, { useEffect, useState } from "react";
import { View, Text, FlatList, StyleSheet, ActivityIndicator, RefreshControl } from "react-native";
import { fetchStudentResults } from "../Service/resultService";

export default function Result() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);

  const loadResults = async () => {
    try {
      const res = await fetchStudentResults();
      setResults(res);
    } catch (err) {
      console.log("Error fetching results:", err);
    } finally {
      setLoading(false);
      setRefreshing(false);
    }
  };

  useEffect(() => {
    loadResults();
  }, []);

  if (loading) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007bff" />
      </View>
    );
  }

  const renderItem = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.quizTitle}>{item.quiz_title}</Text>
      <Text style={styles.score}>
        Score: {item.obtained_score} / {item.total_score}
      </Text>
      <Text style={styles.date}>{item.date}</Text>
    </View>
  );

  return (
    <FlatList
      data={results}
      keyExtractor={(item, index) => index.toString()}
      renderItem={renderItem}
      contentContainerStyle={{ padding: 20 }}
      refreshControl={
        <RefreshControl refreshing={refreshing} onRefresh={() => { setRefreshing(true); loadResults(); }} />
      }
      ListEmptyComponent={<Text style={{ textAlign: "center", marginTop: 20 }}>No results yet</Text>}
    />
  );
}

const styles = StyleSheet.create({
  loader: { flex: 1, justifyContent: "center", alignItems: "center" },
  card: { backgroundColor: "#f0f4f7", padding: 15, borderRadius: 10, marginBottom: 15 },
  quizTitle: { fontSize: 18, fontWeight: "bold" },
  score: { fontSize: 16, marginTop: 5 },
  date: { fontSize: 14, color: "gray", marginTop: 5 },
});

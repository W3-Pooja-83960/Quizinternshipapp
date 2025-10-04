import React, { useEffect, useState } from "react";
import { View, Text, FlatList, ActivityIndicator, StyleSheet } from "react-native";
import { fetchStudentResults } from "../Service/resultService";

export default function ResultTab() {
  const [results, setResults] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadResults = async () => {
      try {
        const data = await fetchStudentResults();
        setResults(data);
      } catch (err) {
        console.error("Error fetching results:", err);
      } finally {
        setLoading(false);
      }
    };
    loadResults();
  }, []);

  if (loading)
    return (
      <View style={styles.center}>
        <ActivityIndicator size="large" color="#ff6347" />
      </View>
    );

  if (!results.length)
    return (
      <View style={styles.center}>
        <Text style={styles.noResultText}>No results found</Text>
      </View>
    );

  return (
    <View style={{ flex: 1 }}>
      {/* Message indicating most recent score */}
      <View style={styles.messageContainer}>
        <Text style={styles.messageText}>
         Scores shown for the most recent attempt
        </Text>
      </View>

      <FlatList
        data={results}
        keyExtractor={(item) => item.attempt_id.toString()}
        contentContainerStyle={{ padding: 16 }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={styles.row}>
              <Text style={styles.quizName}>{item.quiz_title}</Text>
              <Text style={styles.groupName}>Group: {item.group_name}</Text>
            </View>
            <View style={styles.row}>
              <Text style={styles.score}>
                Score: {item.obtained_score ?? 0} / {item.total_score ?? 0}
              </Text>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center" },
  noResultText: { fontSize: 18, color: "gray" },

  messageContainer: {
    padding: 12,
    backgroundColor: "#f3f0ebff",
    alignItems: "center",
  },

  messageText: {
    fontSize: 14,
    color: "#b1a2b3ff",
    fontWeight: "bold",
  },

  card: {
    backgroundColor: "#f5f6f8",
    borderRadius: 12,
    padding: 16,
    marginBottom: 12,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 6,
    elevation: 4,
  },

  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginBottom: 6,
  },

  quizName: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#333",
  },

  score: {
    fontWeight: "bold",
    fontSize: 16,
    color: "#ff6347",
  },

  groupName: {
    fontSize: 14,
    color: "#555",
  },
});

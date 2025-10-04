import React, { useEffect, useState } from "react";
import { View, Text, FlatList, TouchableOpacity, ActivityIndicator, StyleSheet } from "react-native";
import { LinearGradient } from "expo-linear-gradient";
import { fetchAssignedQuizzes, fetchStudentResults } from "../Service/quizListService";

export default function QuizList({ groupName, navigation }) {
  const [quizzes, setQuizzes] = useState([]);
  const [loading, setLoading] = useState(true);
  const [submittedQuizzes, setSubmittedQuizzes] = useState([]);

  useEffect(() => {
    const loadQuizzes = async () => {
      try {
        if (!groupName) return;

        // Fetch only quizzes assigned to this group
        const assignedQuizzes = await fetchAssignedQuizzes(groupName);
        setQuizzes(assignedQuizzes || []);

        // Fetch quizzes already submitted by the student
        const submittedResponse = await fetchStudentResults();
        const attemptedQuizIds = (submittedResponse?.data || []).map(q => q.quiz_id);
        setSubmittedQuizzes(attemptedQuizIds);

      } catch (err) {
        console.error("Error fetching quizzes:", err.message);
      } finally {
        setLoading(false);
      }
    };

    loadQuizzes();
  }, [groupName]);

  if (loading) {
    return <ActivityIndicator size="large" style={{ flex: 1 }} color="#93c8ecff" />;
  }

  if (quizzes.length === 0) {
    return (
      <View style={styles.center}>
        <Text style={{ color: "#34495E", fontSize: 16 }}>No quizzes assigned</Text>
      </View>
    );
  }

  const handleQuizPress = (quiz) => {
    if (submittedQuizzes.includes(quiz.quiz_id)) return;

    navigation.navigate("QuizAttempt", {
      quizId: quiz.quiz_id,
      quizTitle: quiz.quiz_title,
    });
  };

  return (
    <FlatList
      data={quizzes}
      keyExtractor={(item) => item.quiz_id.toString()}
      contentContainerStyle={styles.listContainer}
      renderItem={({ item }) => {
        const attempted = submittedQuizzes.includes(item.quiz_id);
        return (
          <TouchableOpacity
            onPress={() => handleQuizPress(item)}
            disabled={attempted}
            style={{ marginBottom: 15 }}
          >
            <LinearGradient
              colors={attempted ? ["#B0B0B0", "#888888"] : ["#8E2DE2", "#4A00E0"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1, y: 1 }}
              style={styles.quizItem}
            >
              <Text style={styles.quizTitle}>{item.quiz_title}</Text>
              <Text style={styles.quizInfo}>Marks: {item.marks} | Duration: {item.duration} mins</Text>
              {attempted && <Text style={styles.attemptedText}>Already Attempted</Text>}
            </LinearGradient>
          </TouchableOpacity>
        );
      }}
    />
  );
}

const styles = StyleSheet.create({
  center: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f2f6fc" },
  listContainer: { padding: 16 },
  quizItem: {
    padding: 20,
    borderRadius: 16,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 3 },
    shadowOpacity: 0.15,
    shadowRadius: 6,
    elevation: 6,
  },
  quizTitle: {
    fontSize: 18,
    fontWeight: "700",
    color: "#fff",
    marginBottom: 6,
  },
  quizInfo: {
    fontSize: 14,
    color: "#e0e0e0",
  },
  attemptedText: {
    marginTop: 8,
    fontWeight: "bold",
    color: "#FFD700",
    fontSize: 14,
  },
});

import React, { useEffect, useState } from "react";
import { View, Text, TouchableOpacity, FlatList, ActivityIndicator, Alert, BackHandler } from "react-native";
import { useFocusEffect } from "@react-navigation/native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { startAttempt, fetchQuestionsByQuiz, submitAnswers } from "../Service/quizAttemptService";
import QuizTimer from "../Timer/QuizTimer"; 
import styles from "../style/quizAttemptStyle";

export default function QuizAttempt({ route, navigation }) {
  const { quizId, quizTitle } = route.params;

  const [questions, setQuestions] = useState([]);
  const [answers, setAnswers] = useState({});
  const [attemptId, setAttemptId] = useState(null);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);
  const [result, setResult] = useState(null);
  const [quizLocked, setQuizLocked] = useState(false);

  // Prevent back navigation while quiz is active
  useFocusEffect(
    React.useCallback(() => {
      const onBackPress = () => {
        Alert.alert("Hold on!", "You cannot go back while the quiz is in progress.");
        return true; // prevent default behavior
      };

      BackHandler.addEventListener("hardwareBackPress", onBackPress);

      // Disable header back button
      const beforeRemoveListener = navigation.addListener("beforeRemove", (e) => {
        if (!quizLocked) return; // allow if quiz already submitted
        e.preventDefault();
        Alert.alert("Hold on!", "You cannot go back while the quiz is in progress.");
      });

      return () => {
        BackHandler.removeEventListener("hardwareBackPress", onBackPress);
        navigation.removeListener("beforeRemove", beforeRemoveListener);
      };
    }, [navigation, quizLocked])
  );

  useEffect(() => {
    startQuiz();
  }, []);

  const startQuiz = async () => {
    try {
      const userId = await AsyncStorage.getItem("userId");
      const groupName = await AsyncStorage.getItem("assignedGroup");

      if (!userId || !groupName) {
        Alert.alert("Error", "User information missing");
        return;
      }

      const attemptData = await startAttempt(quizId, parseInt(userId), groupName);
      setAttemptId(attemptData?.attempt_id);

      const fetchedQuestions = await fetchQuestionsByQuiz(quizId);
      setQuestions(fetchedQuestions || []);
    } catch (err) {
      console.log("Error starting attempt:", err);
      Alert.alert("Error", "Failed to start quiz");
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (questionId, option) => {
    if (quizLocked) return;
    setAnswers({ ...answers, [questionId]: option });
  };

  const handleSubmit = async () => {
    if (!attemptId) {
      Alert.alert("Error", "Attempt not started");
      return;
    }

    const formattedAnswers = Object.keys(answers).map(qid => ({
      question_id: parseInt(qid),
      answer: answers[qid],
    }));

    if (formattedAnswers.length === 0) {
      Alert.alert("Error", "Please select at least one answer");
      return;
    }

    try {
      setSubmitting(true);
      setQuizLocked(true);
      const resultData = await submitAnswers(attemptId, quizId, formattedAnswers);
      setResult(resultData);

      setTimeout(() => {
        navigation.navigate("AppTabs", { screen: "Home" });
      }, 5000);
    } catch (err) {
      console.log("Error submitting quiz:", err);
      Alert.alert("Error", "Failed to submit quiz");
    } finally {
      setSubmitting(false);
    }
  };

  const handleTimeUp = () => {
    Alert.alert("Time's up!", "Quiz submitted automatically.");
    handleSubmit();
  };

  if (loading || submitting) {
    return (
      <View style={styles.loader}>
        <ActivityIndicator size="large" color="#007BFF" />
      </View>
    );
  }

  if (result) {
    return (
      <View style={styles.resultContainer}>
        <View style={styles.resultCard}>
          <Text style={styles.resultText}>Quiz Submitted!</Text>
          <Text style={styles.resultScore}>
            Score: {result.obtained_score} / {result.total_score}
          </Text>
          <Text style={styles.redirectText}>Redirecting to Quiz List...</Text>
        </View>
      </View>
    );
  }

  const renderQuestion = ({ item }) => (
    <View style={styles.card}>
      <Text style={styles.question}>{item.question_text}</Text>
      {["option_a", "option_b", "option_c", "option_d"].map(optKey => (
        <TouchableOpacity
          key={optKey}
          style={[
            styles.option,
            answers[item.question_id] === item[optKey] && styles.selected
          ]}
          onPress={() => handleSelect(item.question_id, item[optKey])}
          disabled={quizLocked}
        >
          <Text style={styles.optionText}>{item[optKey]}</Text>
        </TouchableOpacity>
      ))}
    </View>
  );

  return (
    <View style={styles.container}>
      <Text style={styles.title}>{quizTitle}</Text>
      <QuizTimer totalTime={1200} onTimeUp={handleTimeUp} />

      <FlatList
        data={questions}
        keyExtractor={item => item.question_id.toString()}
        renderItem={renderQuestion}
        contentContainerStyle={{ paddingBottom: 120 }}
      />

      <TouchableOpacity 
        style={styles.submitBtn} 
        onPress={handleSubmit} 
        disabled={quizLocked}
      >
        <Text style={styles.submitText}>Submit Quiz</Text>
      </TouchableOpacity>
    </View>
  );
}

import React, { useState, useEffect } from "react";
import { Text, StyleSheet } from "react-native";

export default function QuizTimer({ totalTime, onTimeUp }) {
  const [timeLeft, setTimeLeft] = useState(totalTime);

  useEffect(() => {
    if (timeLeft <= 0) {
      onTimeUp();
      return;
    }

    const timerId = setInterval(() => setTimeLeft(prev => prev - 1), 1000);
    return () => clearInterval(timerId);
  }, [timeLeft, onTimeUp]);

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins.toString().padStart(2,"0")}:${secs.toString().padStart(2,"0")}`;
  };

  return <Text style={styles.timer}>Time Left: {formatTime(timeLeft)}</Text>;
}

const styles = StyleSheet.create({
  timer: { fontSize: 24, textAlign: "center", marginBottom: 20 },
});

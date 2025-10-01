// src/screens/HomeScreen.js
import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity } from "react-native";

export default function HomeScreen({ navigation }) {
  // Frases em PT, FR, EN
  const frases = [
    "Bemvindo ao Proflex",
    "Bienvenue à Proflex",
    "Welcome to Proflex",
  ];

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animar = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(2000),
        Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % frases.length);
      });
    };
    animar();
  }, [index]);

  return (
    <LinearGradient colors={["#6e7d87", "#d7dbdd"]} style={styles.container}>
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        {frases[index]}
      </Animated.Text>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Agenda")}
      >
        <Text style={styles.buttonText}>Start Now</Text>
      </TouchableOpacity>
    </LinearGradient>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  title: {
    fontSize: 42,
    color: "#eee",
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 50,
    textShadowColor: "rgba(0,0,0,0.3)",
    textShadowOffset: { width: 1, height: 1 },
    textShadowRadius: 2,
  },
  button: {
    backgroundColor: "#4390a1",
    paddingHorizontal: 30,
    paddingVertical: 12,
    borderRadius: 8,
    elevation: 5,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
});

import { LinearGradient } from "expo-linear-gradient";
import { useEffect, useRef, useState } from "react";
import { Animated, StyleSheet, Text, TouchableOpacity, View } from "react-native";

export default function HomeScreen({ navigation }) {
  const frases = [
    "Bem-vindo ao Proflex",
    "Bienvenue à Proflex",
    "Welcome to Proflex",
  ];

  const [index, setIndex] = useState(0);
  const fadeAnim = useRef(new Animated.Value(0)).current;

  useEffect(() => {
    const animar = () => {
      Animated.sequence([
        Animated.timing(fadeAnim, { toValue: 1, duration: 1000, useNativeDriver: true }),
        Animated.delay(2500),
        Animated.timing(fadeAnim, { toValue: 0, duration: 1000, useNativeDriver: true }),
      ]).start(() => {
        setIndex((prev) => (prev + 1) % frases.length);
      });
    };
    animar();
  }, [index]);

  return (
    <LinearGradient colors={["#6e7d87", "#4a555d", "#2f3438"]} style={styles.container}>
      <View style={styles.overlay} />

      {/* Frases animadas */}
      <Animated.Text style={[styles.title, { opacity: fadeAnim }]}>
        {frases[index]}
      </Animated.Text>

      {/* Botões */}
      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("Agenda")}
      >
        <Text style={styles.buttonText}>Start Now</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("News")} // 👈 vai para tela News
      >
        <Text style={styles.buttonText}>Assinar</Text>
      </TouchableOpacity>

      <TouchableOpacity
        style={styles.button}
        onPress={() => navigation.navigate("News")} // 👈 mesma tela News
      >
        <Text style={styles.buttonText}>Notícias</Text>
      </TouchableOpacity>

      {/* Rodapé */}
      <View style={styles.footer}>
        <Text style={styles.footerText}>
          Proflex system helps professionals manage their schedules, reminders, and client data – all in one place.
        </Text>
      </View>
    </LinearGradient>
  );
}

const azulProflex = "#4390a1";
const cinzaEscuro = "#2f3438";
const cinzaClaro = "#eee";

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
    position: "relative",
  },
  overlay: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "rgba(0,0,0,0.25)", 
  },
  title: {
    fontSize: 44,
    color: cinzaClaro,
    fontWeight: "bold",
    fontStyle: "italic",
    letterSpacing: 1,
    textAlign: "center",
    marginBottom: 50,
    textShadowColor: "rgba(0,0,0,0.5)",
    textShadowOffset: { width: 2, height: 2 },
    textShadowRadius: 4,
  },
  button: {
    backgroundColor: azulProflex,
    paddingHorizontal: 28,
    paddingVertical: 12,
    borderRadius: 10,
    elevation: 4,
    marginVertical: 6,
  },
  buttonText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  footer: {
    marginTop: 50,
    paddingHorizontal: 15,
  },
  footerText: {
    color: cinzaClaro,
    fontSize: 13,
    textAlign: "center",
    lineHeight: 18,
  },
});

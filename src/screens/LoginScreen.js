import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  KeyboardAvoidingView,
  Platform,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { useTheme } from "../context/ThemeContext"; // contexto do dark mode

export default function LoginScreen({ navigation }) {
  const { theme } = useTheme();
  const isDark = theme === "dark";

  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [senha, setSenha] = useState("");
  const [mensagem, setMensagem] = useState("");
  const emailRef = useRef(null);

  useEffect(() => {
    emailRef.current?.focus();
  }, []);

  async function handleSubmit() {
    if (email && senha && phone) {
      const userData = {
        email,
        phone,
      };
      await AsyncStorage.setItem("userProfile", JSON.stringify(userData));
      setMensagem("Login ok. Redirecionando…");
      setTimeout(() => {
        navigation.replace("Main"); // vai direto para as tabs
      }, 1000);
    } else {
      setMensagem("Preencha email, WhatsApp e senha.");
    }
  }

  return (
    <KeyboardAvoidingView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f2f2f2" },
      ]}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <View
        style={[
          styles.box,
          { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Text
          style={[
            styles.title,
            { color: isDark ? "#fff" : "#000" },
          ]}
        >
          Login
        </Text>

        <TextInput
          ref={emailRef}
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Digite seu email"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          keyboardType="email-address"
          autoCapitalize="none"
          value={email}
          onChangeText={setEmail}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Digite seu WhatsApp (+55...)"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          keyboardType="phone-pad"
          autoCapitalize="none"
          value={phone}
          onChangeText={setPhone}
        />

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Digite sua senha"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          secureTextEntry
          value={senha}
          onChangeText={setSenha}
        />

        <TouchableOpacity style={styles.button} onPress={handleSubmit}>
          <Text style={styles.buttonText}>Entrar</Text>
        </TouchableOpacity>

        {mensagem ? (
          <Text
            style={[
              styles.message,
              { color: isDark ? "#ff7373" : "#d9534f" },
            ]}
          >
            {mensagem}
          </Text>
        ) : null}

        <Text style={[styles.hint, { color: isDark ? "#aaa" : "#777" }]}>
          Credenciais de teste: qualquer email, WhatsApp e senha
        </Text>
      </View>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    padding: 20,
  },
  box: {
    width: "100%",
    maxWidth: 400,
    borderRadius: 10,
    padding: 20,
    elevation: 3,
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowRadius: 5,
    shadowOffset: { width: 0, height: 2 },
  },
  title: {
    fontSize: 26,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 20,
  },
  input: {
    width: "100%",
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 12,
    marginBottom: 15,
    fontSize: 16,
  },
  button: {
    backgroundColor: "#4390a1",
    paddingVertical: 14,
    borderRadius: 8,
    marginBottom: 10,
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    textAlign: "center",
    fontWeight: "bold",
  },
  message: {
    textAlign: "center",
    marginTop: 8,
  },
  hint: {
    marginTop: 15,
    textAlign: "center",
    fontSize: 12,
  },
});

// src/screens/MarketingScreen.js
import React, { useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Share,
  Linking,
  Alert,
} from "react-native";

export default function MarketingScreen() {
  const [mensagem, setMensagem] = useState("");
  const [campanhas, setCampanhas] = useState([
    {
      id: "1",
      titulo: "Promoção de Outubro",
      msg: "🎉 Promoção especial em Outubro! Agende sua consulta e ganhe 20% de desconto.",
    },
    {
      id: "2",
      titulo: "Lembrete de Consulta",
      msg: "Olá! Não esqueça da sua consulta marcada conosco. Estamos te esperando! 🧑‍⚕️",
    },
  ]);

  // Criar nova campanha
  const addCampanha = () => {
    if (!mensagem.trim()) {
      Alert.alert("Erro", "Digite uma mensagem para criar a campanha.");
      return;
    }
    const nova = {
      id: Date.now().toString(),
      titulo: "Campanha",
      msg: mensagem.trim(),
    };
    setCampanhas([nova, ...campanhas]);
    setMensagem("");
  };

  // Compartilhar mensagem
  const shareMensagem = async (msg) => {
    try {
      await Share.share({ message: msg });
    } catch (e) {
      console.log("Erro ao compartilhar:", e);
    }
  };

  // Enviar via WhatsApp
  const sendWhatsApp = (msg) => {
    const url = `whatsapp://send?text=${encodeURIComponent(msg)}`;
    Linking.openURL(url).catch(() =>
      Alert.alert("Erro", "WhatsApp não está instalado neste dispositivo.")
    );
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Campanhas de Marketing</Text>

      {/* Criar nova campanha */}
      <TextInput
        style={styles.input}
        placeholder="Escreva sua mensagem de campanha..."
        value={mensagem}
        onChangeText={setMensagem}
      />
      <TouchableOpacity style={styles.button} onPress={addCampanha}>
        <Text style={styles.buttonText}>Adicionar Campanha</Text>
      </TouchableOpacity>

      {/* Lista de campanhas */}
      <FlatList
        data={campanhas}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20, width: "100%" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.titulo}</Text>
              <Text style={styles.info}>{item.msg}</Text>
            </View>
            <View style={styles.actions}>
              <TouchableOpacity
                style={styles.shareButton}
                onPress={() => shareMensagem(item.msg)}
              >
                <Text style={styles.actionText}>Compartilhar</Text>
              </TouchableOpacity>
              <TouchableOpacity
                style={styles.whatsButton}
                onPress={() => sendWhatsApp(item.msg)}
              >
                <Text style={styles.actionText}>WhatsApp</Text>
              </TouchableOpacity>
            </View>
          </View>
        )}
      />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: "#f9f9f9",
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    marginBottom: 15,
    textAlign: "center",
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
    backgroundColor: "#fff",
  },
  button: {
    backgroundColor: "#4390a1",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
  },
  buttonText: {
    color: "#fff",
    fontSize: 16,
    fontWeight: "600",
  },
  card: {
    backgroundColor: "#fff",
    padding: 15,
    borderRadius: 10,
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
    marginBottom: 5,
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  actions: {
    flexDirection: "row",
    marginTop: 10,
    justifyContent: "flex-end",
    gap: 10,
  },
  shareButton: {
    backgroundColor: "#007bff",
    padding: 8,
    borderRadius: 6,
  },
  whatsButton: {
    backgroundColor: "#25D366",
    padding: 8,
    borderRadius: 6,
  },
  actionText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

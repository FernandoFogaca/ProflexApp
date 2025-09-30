// src/screens/AgendaScreen.js
import React, { useState, useEffect } from "react";
import { View, Text, ScrollView, StyleSheet, TouchableOpacity, TextInput } from "react-native";
import { Card, Button, Chip } from "react-native-paper";
import { Ionicons } from "@expo/vector-icons";

const baseSlots = ["08:00","09:00","10:00","11:00","12:00","13:00","14:00","15:00"];

export default function AgendaScreen() {
  const [horaAtual, setHoraAtual] = useState(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
  const [data, setData] = useState(new Date().toISOString().slice(0,10));
  const [slots, setSlots] = useState(baseSlots);
  const [novoSlot, setNovoSlot] = useState("09:00");
  const [lembretes, setLembretes] = useState([]);
  const [lemHora, setLemHora] = useState("14:00");
  const [lemMsg, setLemMsg] = useState("");

  // Relógio
  useEffect(() => {
    const timer = setInterval(() => {
      setHoraAtual(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  // Adicionar novo slot
  const addSlot = () => {
    if (!slots.includes(novoSlot)) {
      setSlots([...slots, novoSlot].sort());
    }
  };

  // Criar lembrete
  const criarLembrete = () => {
    if (lemMsg.trim() === "") return;
    setLembretes([...lembretes, { hora: lemHora, msg: lemMsg }]);
    setLemMsg("");
  };

  return (
    <ScrollView style={styles.container}>
      {/* Topo */}
      <Card style={styles.topCard}>
        <Card.Content>
          <View style={styles.topRow}>
            <Text style={styles.topText}>Bom dia 🌤️</Text>
            <Text style={styles.topText}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
            </Text>
          </View>
          <Text style={styles.clock}>{horaAtual}</Text>
          <Text style={styles.date}>{data}</Text>
        </Card.Content>
      </Card>

      {/* Horários */}
      <Card style={styles.card}>
        <Card.Title title="Horários" />
        <Card.Content>
          <View style={styles.slotsRow}>
            {slots.map((s, i) => (
              <TouchableOpacity key={i} style={styles.slot}>
                <Text style={styles.slotText}>{s}</Text>
              </TouchableOpacity>
            ))}
          </View>

          <View style={styles.addRow}>
            <TextInput
              style={styles.input}
              value={novoSlot}
              onChangeText={setNovoSlot}
              placeholder="HH:MM"
            />
            <Button mode="contained" onPress={addSlot}>
              + Adicionar horário
            </Button>
          </View>
        </Card.Content>
      </Card>

      {/* Lembretes */}
      <Card style={styles.card}>
        <Card.Title title="🔔 Lembretes + WhatsApp" />
        <Card.Content>
          <View style={styles.addRow}>
            <TextInput
              style={[styles.input, { flex: 0.4 }]}
              value={lemHora}
              onChangeText={setLemHora}
              placeholder="HH:MM"
            />
            <TextInput
              style={[styles.input, { flex: 1 }]}
              value={lemMsg}
              onChangeText={setLemMsg}
              placeholder="Ex: ligar para Maria"
            />
            <Button mode="contained" onPress={criarLembrete}>
              Criar
            </Button>
          </View>

          {lembretes.length === 0 ? (
            <Text style={{ marginTop: 10, color: "#666" }}>Sem lembretes.</Text>
          ) : (
            lembretes.map((l, i) => (
              <Chip
                key={i}
                icon="alarm"
                style={{ marginTop: 6 }}
              >
                {l.hora} — {l.msg}
              </Chip>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Legenda */}
      <View style={styles.legenda}>
        <Chip style={{ backgroundColor: "#28a745" }}>confirmado</Chip>
        <Chip style={{ backgroundColor: "#ffc107" }}>proximo</Chip>
        <Chip style={{ backgroundColor: "#dc3545" }}>na hora</Chip>
        <Chip style={{ backgroundColor: "#6c757d" }}>cancelado</Chip>
        <Chip style={{ backgroundColor: "#0dcaf0" }}>concluido</Chip>
      </View>

      <Text style={styles.footer}>ProFlex</Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 12,
    backgroundColor: "#f8f9fa",
  },
  topCard: {
    marginBottom: 12,
    backgroundColor: "#4390a1",
  },
  topRow: {
    flexDirection: "row",
    justifyContent: "space-between",
  },
  topText: {
    color: "#fff",
    fontWeight: "bold",
    fontSize: 16,
  },
  clock: {
    fontSize: 36,
    fontWeight: "bold",
    color: "#fff",
    textAlign: "center",
    marginVertical: 6,
  },
  date: {
    textAlign: "center",
    color: "#fff",
    fontWeight: "600",
  },
  card: {
    marginBottom: 12,
  },
  slotsRow: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
  },
  slot: {
    width: 64,
    height: 64,
    borderRadius: 32,
    borderWidth: 2,
    borderColor: "#28a745",
    alignItems: "center",
    justifyContent: "center",
    margin: 6,
  },
  slotText: {
    fontWeight: "bold",
    color: "#28a745",
  },
  addRow: {
    flexDirection: "row",
    alignItems: "center",
    marginTop: 12,
    gap: 6,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 6,
    padding: 8,
    backgroundColor: "#fff",
  },
  legenda: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 6,
    marginTop: 12,
  },
  footer: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 18,
    fontWeight: "bold",
    letterSpacing: 4,
  },
});

import React, { useState, useEffect } from "react";
import {
  View, Text, ScrollView, StyleSheet, TouchableOpacity,
  Modal, Pressable, TextInput, Platform, Alert
} from "react-native";
import { Card, Button, Chip } from "react-native-paper";
import AsyncStorage from "@react-native-async-storage/async-storage";
import * as Location from "expo-location";
import * as Notifications from "expo-notifications";
import DateTimePicker from "@react-native-community/datetimepicker";
import { useTheme } from "../context/ThemeContext";

// Helpers
const isPast = (dateISO, hhmm) => {
  const [y, m, d] = dateISO.split("-").map(Number);
  const [H, M] = hhmm.split(":").map(Number);
  const dt = new Date(y, m - 1, d, H, M);
  return dt.getTime() < Date.now();
};

export default function AgendaScreen({ navigation }) {
  const { theme } = useTheme(); // 👈 pega tema
  const isDark = theme === "dark";

  const hoje = new Date().toISOString().slice(0, 10);
  const [horaAtual, setHoraAtual] = useState(
    new Date().toLocaleTimeString("pt-BR", { hour12: false })
  );
  const [dataISO, setDataISO] = useState(hoje);

  const [agendamentos, setAgendamentos] = useState([]);
  const [slotSelecionado, setSlotSelecionado] = useState(null);
  const [titulo, setTitulo] = useState("");
  const [descricao, setDescricao] = useState("");
  const [dataHora, setDataHora] = useState(new Date());

  const [cidade, setCidade] = useState("");
  const [regiao, setRegiao] = useState("");
  const [temp, setTemp] = useState(null);
  const [saudacao, setSaudacao] = useState("");

  const [lembretes, setLembretes] = useState([]);
  const [lemHora, setLemHora] = useState(new Date());
  const [showLemPicker, setShowLemPicker] = useState(false);
  const [lemMsg, setLemMsg] = useState("");
  const [lemEditando, setLemEditando] = useState(null);

  const [showPicker, setShowPicker] = useState(null);

  useEffect(() => {
    const updateTime = () => {
      setHoraAtual(new Date().toLocaleTimeString("pt-BR", { hour12: false }));
      const h = new Date().getHours();
      if (h < 12) setSaudacao("Bom dia ☀️");
      else if (h < 18) setSaudacao("Boa tarde 🌤️");
      else setSaudacao("Boa noite 🌙");
    };
    updateTime();
    const timer = setInterval(updateTime, 60000);
    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    (async () => {
      const data = await AsyncStorage.getItem("agendamentos");
      if (data) setAgendamentos(JSON.parse(data));
    })();
  }, []);

  const saveAgendamentos = async (list) => {
    setAgendamentos(list);
    await AsyncStorage.setItem("agendamentos", JSON.stringify(list));
  };

  useEffect(() => {
    (async () => {
      try {
        let { status } = await Location.requestForegroundPermissionsAsync();
        if (status !== "granted") return;
        let location = await Location.getCurrentPositionAsync({});
        const { latitude, longitude } = location.coords;

        const r = await fetch(
          `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${latitude}&longitude=${longitude}&localityLanguage=pt`
        );
        const j = await r.json();
        setCidade(j.city || j.locality || j.principalSubdivision || "");
        setRegiao(j.principalSubdivision || "");

        const w = await fetch(
          `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current=temperature_2m&timezone=auto`
        );
        const jw = await w.json();
        setTemp(jw?.current?.temperature_2m ?? null);
      } catch (e) {
        console.log("Erro localização/clima", e);
      }
    })();
  }, []);

  useEffect(() => {
    Notifications.requestPermissionsAsync();
  }, []);

  const salvarAgendamento = () => {
    const dataStr = dataHora.toISOString().slice(0, 10);
    const horaStr = dataHora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let lista = [];
    if (slotSelecionado && slotSelecionado !== "novo") {
      lista = agendamentos.map((a) =>
        a.id === slotSelecionado
          ? { ...a, titulo, descricao, data: dataStr, hora: horaStr }
          : a
      );
    } else {
      lista = [
        { id: Date.now(), data: dataStr, hora: horaStr, titulo, descricao },
        ...agendamentos,
      ];
    }
    saveAgendamentos(lista);
    fecharModal();
  };

  const deletarAgendamento = () => {
    const lista = agendamentos.filter((a) => a.id !== slotSelecionado);
    saveAgendamentos(lista);
    fecharModal();
  };

  const fecharModal = () => {
    setSlotSelecionado(null);
    setTitulo("");
    setDescricao("");
    setDataHora(new Date());
  };

  const proximas4h = agendamentos.filter((a) => {
    const [h, m] = a.hora.split(":").map(Number);
    const dt = new Date(`${a.data}T${h.toString().padStart(2, "0")}:${m.toString().padStart(2, "0")}`);
    const agora = new Date();
    const quatroH = new Date(agora.getTime() + 4 * 60 * 60 * 1000);
    return dt >= agora && dt <= quatroH;
  });

  const criarOuEditarLembrete = () => {
    if (!lemMsg.trim()) return;
    const horaStr = lemHora.toLocaleTimeString("pt-BR", {
      hour: "2-digit",
      minute: "2-digit",
    });

    let lista = [];
    if (lemEditando) {
      lista = lembretes.map((l) =>
        l.id === lemEditando ? { ...l, msg: lemMsg, hora: horaStr } : l
      );
    } else {
      lista = [{ id: Date.now(), hora: horaStr, msg: lemMsg }, ...lembretes];
    }

    setLembretes(lista);
    setLemMsg("");
    setLemEditando(null);

    const [h, m] = horaStr.split(":").map(Number);
    let dataNoti = new Date();
    dataNoti.setHours(h, m, 0);
    if (dataNoti > new Date()) {
      Notifications.scheduleNotificationAsync({
        content: { title: "⏰ Lembrete", body: lemMsg },
        trigger: { date: dataNoti },
      });
    }
  };

  const deletarLembrete = (id) => {
    const lista = lembretes.filter((l) => l.id !== id);
    setLembretes(lista);
  };

  const abrirDatePicker = () => setShowPicker("date");
  const onChangePicker = (event, selectedDate) => {
    if (!selectedDate) {
      setShowPicker(null);
      return;
    }
    if (showPicker === "date") {
      const newDate = new Date(selectedDate);
      setDataHora(newDate);
      setShowPicker("time");
    } else if (showPicker === "time") {
      const newDate = new Date(dataHora);
      newDate.setHours(selectedDate.getHours(), selectedDate.getMinutes());
      setDataHora(newDate);
      setShowPicker(null);
    }
  };

  return (
    <ScrollView
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f8f9fa" },
      ]}
    >
      {/* Topo */}
      <Card style={[styles.topCard]}>
        <Card.Content>
          <View style={styles.topRow}>
            <Text style={styles.topText}>{saudacao}</Text>
            <Text style={styles.topText}>
              {new Date().toLocaleDateString("pt-BR", { weekday: "long" })}
            </Text>
          </View>
          <Text style={styles.clock}>{horaAtual}</Text>
          <Text style={styles.date}>{dataISO}</Text>
          <Text style={styles.city}>
            📍 {cidade} {regiao} {temp !== null ? `— ${Math.round(temp)}°C` : ""}
          </Text>
        </Card.Content>
      </Card>

      {/* Slots */}
      <Card
        style={[
          styles.card,
          { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
        ]}
      >
        <Card.Title
          title="Horários"
          titleStyle={{ color: isDark ? "#fff" : "#000" }}
        />
        <Card.Content>
          <View style={styles.slotsRow}>
            {agendamentos.map((s) => (
              <TouchableOpacity
                key={s.id}
                style={[
                  styles.slot,
                  { backgroundColor: isDark ? "#2a2a2a" : "#fff" },
                  isPast(s.data, s.hora) && { opacity: 0.4 },
                ]}
                onPress={() => {
                  setSlotSelecionado(s.id);
                  setTitulo(s.titulo);
                  setDescricao(s.descricao);
                  setDataHora(new Date(`${s.data}T${s.hora}`));
                }}
              >
                <Text style={[styles.slotText]}>{s.hora}</Text>
                <Text style={{ fontSize: 10, color: isDark ? "#ccc" : "#000" }}>
                  {s.titulo}
                </Text>
              </TouchableOpacity>
            ))}
          </View>

          <Button
            mode="contained"
            buttonColor="#4390a1"
            style={{ marginTop: 12 }}
            onPress={() => {
              setSlotSelecionado("novo");
              setTitulo("");
              setDescricao("");
              setDataHora(new Date());
            }}
          >
            + Adicionar horário
          </Button>
        </Card.Content>
      </Card>

      {/* Próximas 4h */}
      <Card
        style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
      >
        <Card.Title
          title="⏱️ Próximas 4 horas"
          titleStyle={{ color: isDark ? "#fff" : "#000" }}
        />
        <Card.Content>
          {proximas4h.length === 0 ? (
            <Text style={{ color: isDark ? "#aaa" : "#666" }}>
              Sem agendamentos.
            </Text>
          ) : (
            proximas4h.map((item) => (
              <Text key={item.id} style={{ color: isDark ? "#fff" : "#000" }}>
                {item.hora} — {item.titulo}
              </Text>
            ))
          )}
        </Card.Content>
      </Card>

      {/* Lembretes */}
      <Card
        style={[styles.card, { backgroundColor: isDark ? "#1e1e1e" : "#fff" }]}
      >
        <Card.Title
          title="🔔 Lembretes"
          titleStyle={{ color: isDark ? "#fff" : "#000" }}
        />
        <Card.Content>
          <Button mode="outlined" onPress={() => setShowLemPicker(true)}>
            Selecionar hora
          </Button>
          {showLemPicker && (
            <DateTimePicker
              value={lemHora}
              mode="time"
              is24Hour
              display={Platform.OS === "ios" ? "spinner" : "default"}
              onChange={(e, d) => {
                setShowLemPicker(false);
                if (d) setLemHora(d);
              }}
            />
          )}
          <TextInput
            style={[
              styles.input,
              {
                backgroundColor: isDark ? "#2a2a2a" : "#fff",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder="Mensagem do lembrete"
            placeholderTextColor={isDark ? "#aaa" : "#666"}
            value={lemMsg}
            onChangeText={setLemMsg}
          />
          <Button
            mode="contained"
            buttonColor="#4390a1"
            onPress={criarOuEditarLembrete}
          >
            {lemEditando ? "Salvar Edição" : "Criar"}
          </Button>

          {lembretes.map((l) => (
            <Chip
              key={l.id}
              icon="alarm"
              style={{ marginTop: 6, backgroundColor: isDark ? "#2a2a2a" : "#eee" }}
              textStyle={{ color: isDark ? "#fff" : "#000" }}
              onPress={() => {
                setLemEditando(l.id);
                setLemMsg(l.msg);
                const [h, m] = l.hora.split(":").map(Number);
                const d = new Date();
                d.setHours(h, m, 0);
                setLemHora(d);
              }}
              onClose={() => deletarLembrete(l.id)}
            >
              {l.hora} — {l.msg}
            </Chip>
          ))}
        </Card.Content>
      </Card>

      {/* Modal do Slot */}
      <Modal transparent visible={slotSelecionado !== null} animationType="fade">
        <Pressable style={styles.modalBg} onPress={fecharModal}>
          <View
            style={[
              styles.modalBox,
              { backgroundColor: isDark ? "#1e1e1e" : "#fff" },
            ]}
          >
            <Text
              style={{
                fontWeight: "bold",
                marginBottom: 12,
                color: isDark ? "#fff" : "#000",
              }}
            >
              {dataHora.toLocaleDateString("pt-BR")} —{" "}
              {dataHora.toLocaleTimeString("pt-BR", {
                hour: "2-digit",
                minute: "2-digit",
              })}
            </Text>
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              placeholder="Título"
              placeholderTextColor={isDark ? "#aaa" : "#666"}
              value={titulo}
              onChangeText={setTitulo}
            />
            <TextInput
              style={[
                styles.input,
                {
                  backgroundColor: isDark ? "#2a2a2a" : "#fff",
                  color: isDark ? "#fff" : "#000",
                },
              ]}
              placeholder="Descrição"
              placeholderTextColor={isDark ? "#aaa" : "#666"}
              value={descricao}
              onChangeText={setDescricao}
            />

            <Button
              mode="outlined"
              onPress={abrirDatePicker}
              style={{ marginVertical: 6 }}
            >
              Selecionar Data/Hora
            </Button>

            {showPicker && (
              <DateTimePicker
                value={dataHora}
                mode={showPicker}
                is24Hour
                display={Platform.OS === "ios" ? "spinner" : "default"}
                onChange={onChangePicker}
              />
            )}

            <Button
              mode="contained"
              buttonColor="#4390a1"
              onPress={salvarAgendamento}
              style={{ marginTop: 8 }}
            >
              Salvar
            </Button>
            {slotSelecionado && slotSelecionado !== "novo" && (
              <Button
                mode="outlined"
                textColor="#4390a1"
                onPress={deletarAgendamento}
                style={{ marginTop: 8 }}
              >
                Deletar
              </Button>
            )}
          </View>
        </Pressable>
      </Modal>

      <Button
        mode="contained"
        buttonColor="#4390a1"
        style={{ marginVertical: 16 }}
        onPress={() => navigation.navigate("Compromissos")}
      >
        Ir para Compromissos
      </Button>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 12 },
  topCard: { marginBottom: 12, backgroundColor: "#4390a1" },
  topRow: { flexDirection: "row", justifyContent: "space-between" },
  topText: { color: "#fff", fontWeight: "bold", fontSize: 16 },
  clock: { fontSize: 36, fontWeight: "bold", color: "#fff", textAlign: "center", marginVertical: 6 },
  date: { textAlign: "center", color: "#fff", fontWeight: "600" },
  city: { textAlign: "center", color: "#fff", fontWeight: "600", marginTop: 4 },
  card: { marginBottom: 12 },
  slotsRow: { flexDirection: "row", flexWrap: "wrap", gap: 12 },
  slot: {
    width: 70, height: 70, borderRadius: 12,
    borderWidth: 2, borderColor: "#4390a1",
    alignItems: "center", justifyContent: "center",
    margin: 4,
  },
  slotText: { fontWeight: "bold", color: "#4390a1" },
  input: {
    borderWidth: 1, borderColor: "#ccc", borderRadius: 6,
    padding: 10, marginTop: 8,
  },
  modalBg: { flex: 1, backgroundColor: "rgba(0,0,0,0.4)", justifyContent: "center", alignItems: "center" },
  modalBox: { padding: 20, borderRadius: 12, width: 280 },
});

// src/screens/CompromissosScreen.js
import React, { useEffect, useState } from "react";
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
} from "react-native";
import AsyncStorage from "@react-native-async-storage/async-storage";

export default function CompromissosScreen() {
  const [titulo, setTitulo] = useState("");
  const [data, setData] = useState("");
  const [hora, setHora] = useState("");
  const [descricao, setDescricao] = useState("");
  const [compromissos, setCompromissos] = useState([]);

  // Carregar compromissos salvos
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("compromissos");
        if (data) setCompromissos(JSON.parse(data));
      } catch (e) {
        console.log("Erro ao carregar compromissos", e);
      }
    };
    loadData();
  }, []);

  // Salvar compromissos
  const saveData = async (list) => {
    try {
      await AsyncStorage.setItem("compromissos", JSON.stringify(list));
    } catch (e) {
      console.log("Erro ao salvar compromissos", e);
    }
  };

  // Adicionar compromisso
  const addCompromisso = () => {
    if (!titulo || !data || !hora) {
      Alert.alert("Erro", "Preencha pelo menos título, data e hora!");
      return;
    }
    const novoCompromisso = {
      id: Date.now().toString(),
      titulo,
      data,
      hora,
      descricao,
    };
    const updatedList = [novoCompromisso, ...compromissos];
    setCompromissos(updatedList);
    saveData(updatedList);
    setTitulo("");
    setData("");
    setHora("");
    setDescricao("");
  };

  // Remover compromisso
  const removeCompromisso = (id) => {
    const updatedList = compromissos.filter((c) => c.id !== id);
    setCompromissos(updatedList);
    saveData(updatedList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Compromissos</Text>

      {/* Formulário */}
      <TextInput
        style={styles.input}
        placeholder="Título"
        value={titulo}
        onChangeText={setTitulo}
      />
      <TextInput
        style={styles.input}
        placeholder="Data (YYYY-MM-DD)"
        value={data}
        onChangeText={setData}
      />
      <TextInput
        style={styles.input}
        placeholder="Hora (HH:MM)"
        value={hora}
        onChangeText={setHora}
      />
      <TextInput
        style={styles.input}
        placeholder="Descrição"
        value={descricao}
        onChangeText={setDescricao}
      />

      <TouchableOpacity style={styles.button} onPress={addCompromisso}>
        <Text style={styles.buttonText}>Adicionar Compromisso</Text>
      </TouchableOpacity>

      {/* Lista de Compromissos */}
      <FlatList
        data={compromissos}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20, width: "100%" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View style={{ flex: 1 }}>
              <Text style={styles.nome}>{item.titulo}</Text>
              <Text style={styles.info}>📅 {item.data} ⏰ {item.hora}</Text>
              {item.descricao ? (
                <Text style={styles.info}>📝 {item.descricao}</Text>
              ) : null}
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removeCompromisso(item.id)}
            >
              <Text style={styles.deleteText}>Excluir</Text>
            </TouchableOpacity>
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
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
    borderColor: "#ddd",
  },
  nome: {
    fontSize: 18,
    fontWeight: "bold",
  },
  info: {
    fontSize: 14,
    color: "#555",
  },
  deleteButton: {
    backgroundColor: "#dc3545",
    padding: 8,
    borderRadius: 6,
  },
  deleteText: {
    color: "#fff",
    fontWeight: "bold",
  },
});

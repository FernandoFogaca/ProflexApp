// src/screens/PacienteScreen.js
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

export default function PacienteScreen() {
  const [nome, setNome] = useState("");
  const [telefone, setTelefone] = useState("");
  const [idade, setIdade] = useState("");
  const [pacientes, setPacientes] = useState([]);

  // Carregar pacientes salvos
  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("pacientes");
        if (data) setPacientes(JSON.parse(data));
      } catch (e) {
        console.log("Erro ao carregar pacientes", e);
      }
    };
    loadData();
  }, []);

  // Salvar pacientes
  const saveData = async (list) => {
    try {
      await AsyncStorage.setItem("pacientes", JSON.stringify(list));
    } catch (e) {
      console.log("Erro ao salvar pacientes", e);
    }
  };

  // Adicionar paciente
  const addPaciente = () => {
    if (!nome || !telefone || !idade) {
      Alert.alert("Erro", "Preencha todos os campos!");
      return;
    }
    const novoPaciente = {
      id: Date.now().toString(),
      nome,
      telefone,
      idade,
    };
    const updatedList = [novoPaciente, ...pacientes];
    setPacientes(updatedList);
    saveData(updatedList);
    setNome("");
    setTelefone("");
    setIdade("");
  };

  // Remover paciente
  const removePaciente = (id) => {
    const updatedList = pacientes.filter((p) => p.id !== id);
    setPacientes(updatedList);
    saveData(updatedList);
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro de Pacientes</Text>

      {/* Formulário */}
      <TextInput
        style={styles.input}
        placeholder="Nome"
        value={nome}
        onChangeText={setNome}
      />
      <TextInput
        style={styles.input}
        placeholder="Telefone"
        keyboardType="phone-pad"
        value={telefone}
        onChangeText={setTelefone}
      />
      <TextInput
        style={styles.input}
        placeholder="Idade"
        keyboardType="numeric"
        value={idade}
        onChangeText={setIdade}
      />

      <TouchableOpacity style={styles.button} onPress={addPaciente}>
        <Text style={styles.buttonText}>Adicionar Paciente</Text>
      </TouchableOpacity>

      {/* Lista de Pacientes */}
      <FlatList
        data={pacientes}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 20, width: "100%" }}
        renderItem={({ item }) => (
          <View style={styles.card}>
            <View>
              <Text style={styles.nome}>{item.nome}</Text>
              <Text style={styles.info}>📞 {item.telefone}</Text>
              <Text style={styles.info}>🎂 {item.idade} anos</Text>
            </View>
            <TouchableOpacity
              style={styles.deleteButton}
              onPress={() => removePaciente(item.id)}
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


import React, { useEffect, useState } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  useColorScheme,
} from "react-native"
import AsyncStorage from "@react-native-async-storage/async-storage"

function calcularIdade(dataNasc) {
  if (!dataNasc) return ""
  const hoje = new Date()
  const nascimento = new Date(dataNasc)
  let idade = hoje.getFullYear() - nascimento.getFullYear()
  const m = hoje.getMonth() - nascimento.getMonth()
  if (m < 0 || (m === 0 && hoje.getDate() < nascimento.getDate())) {
    idade--
  }
  return idade
}

export default function PacienteScreen({ navigation }) {
  const [nome, setNome] = useState("")
  const [telefone, setTelefone] = useState("")
  const [nascimento, setNascimento] = useState("")
  const [pacientes, setPacientes] = useState([])
  const [busca, setBusca] = useState("")
  const scheme = useColorScheme() // "light" ou "dark"
  const isDark = scheme === "dark"

  useEffect(() => {
    const loadData = async () => {
      try {
        const data = await AsyncStorage.getItem("pacientes")
        if (data) setPacientes(JSON.parse(data))
      } catch (e) {
        console.log("Erro ao carregar pacientes", e)
      }
    }
    loadData()
  }, [])

  const saveData = async (list) => {
    try {
      await AsyncStorage.setItem("pacientes", JSON.stringify(list))
    } catch (e) {
      console.log("Erro ao salvar pacientes", e)
    }
  }

  const addPaciente = () => {
    if (!nome || !telefone || !nascimento) {
      Alert.alert("Erro", "Preencha todos os campos!")
      return
    }
    const idade = calcularIdade(nascimento)
    const novoPaciente = {
      id: Date.now().toString(),
      nome,
      telefone,
      nascimento,
      idade,
    }
    const updatedList = [novoPaciente, ...pacientes]
    setPacientes(updatedList)
    saveData(updatedList)
    setNome("")
    setTelefone("")
    setNascimento("")
  }

  const resultado = pacientes.filter(
    (p) =>
      p.nome.toLowerCase().includes(busca.toLowerCase()) ||
      p.telefone.includes(busca)
  )

  return (
    <View
      style={[
        styles.container,
        { backgroundColor: isDark ? "#121212" : "#f1f1f1" },
      ]}
    >
      <View
        style={[
          styles.box,
          { backgroundColor: isDark ? "#1e1e1e" : "#4390a1" },
        ]}
      >
        <Text style={[styles.title, { color: isDark ? "#fff" : "#fff" }]}>
          Cadastro de Pacientes
        </Text>

        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Nome"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          value={nome}
          onChangeText={setNome}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Telefone"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          keyboardType="phone-pad"
          value={telefone}
          onChangeText={setTelefone}
        />
        <TextInput
          style={[
            styles.input,
            {
              backgroundColor: isDark ? "#2a2a2a" : "#fff",
              color: isDark ? "#fff" : "#000",
            },
          ]}
          placeholder="Data de Nascimento (AAAA-MM-DD)"
          placeholderTextColor={isDark ? "#aaa" : "#666"}
          value={nascimento}
          onChangeText={setNascimento}
        />

        <TouchableOpacity style={styles.button} onPress={addPaciente}>
          <Text style={styles.buttonText}>Adicionar Paciente</Text>
        </TouchableOpacity>

        <View style={{ flexDirection: "row", marginTop: 15 }}>
          <TextInput
            style={[
              styles.input,
              {
                flex: 1,
                backgroundColor: isDark ? "#2a2a2a" : "#fff",
                color: isDark ? "#fff" : "#000",
              },
            ]}
            placeholder="Pesquisar por nome ou telefone..."
            placeholderTextColor={isDark ? "#aaa" : "#666"}
            value={busca}
            onChangeText={setBusca}
          />
          <TouchableOpacity
            style={[styles.button, { marginLeft: 8, paddingHorizontal: 16 }]}
            onPress={() => {}}
          >
            <Text style={styles.buttonText}>🔍</Text>
          </TouchableOpacity>
        </View>
      </View>

      <FlatList
        data={resultado}
        keyExtractor={(item) => item.id}
        style={{ marginTop: 10, width: "100%" }}
        renderItem={({ item }) => (
          <TouchableOpacity
            style={[
              styles.card,
              {
                backgroundColor: isDark ? "#1e1e1e" : "#fff",
                borderColor: isDark ? "#333" : "#ddd",
              },
            ]}
            onPress={() =>
              navigation.navigate("CadastroCompleto", { paciente: item })
            }
          >
            <View>
              <Text
                style={[styles.nome, { color: isDark ? "#fff" : "#000" }]}
              >
                {item.nome}
              </Text>
              <Text
                style={[styles.info, { color: isDark ? "#ccc" : "#555" }]}
              >
                📞 {item.telefone}
              </Text>
              <Text
                style={[styles.info, { color: isDark ? "#ccc" : "#555" }]}
              >
                🎂 {item.nascimento} ({item.idade} anos)
              </Text>
            </View>
          </TouchableOpacity>
        )}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20 },
  box: {
    padding: 20,
    borderRadius: 14,
    marginBottom: 20,
    marginTop: 30,
    width: "100%",
    shadowColor: "#000",
    shadowOpacity: 0.1,
    shadowOffset: { width: 0, height: 2 },
    shadowRadius: 4,
    elevation: 3,
  },
  title: {
    fontSize: 22,
    fontWeight: "bold",
    textAlign: "center",
    marginBottom: 15,
  },
  input: {
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
    marginBottom: 10,
  },
  button: {
    backgroundColor: "#2c6c7a",
    padding: 12,
    borderRadius: 8,
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: { color: "#fff", fontSize: 16, fontWeight: "600" },
  card: {
    padding: 15,
    borderRadius: 10,
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 10,
    borderWidth: 1,
  },
  nome: { fontSize: 18, fontWeight: "bold" },
  info: { fontSize: 14 },
})

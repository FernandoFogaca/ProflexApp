import React from "react";
import { View, Text, StyleSheet, Image, TouchableOpacity } from "react-native";

export default function CadastroCompleto({ route }) {
  const { paciente } = route.params || {};

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Cadastro Completo.  Exemplo de como ficará</Text>

      {paciente ? (
        <>
          <Text style={styles.info}>👤 Nome: {paciente.nome}</Text>
          <Text style={styles.info}>📞 Telefone: {paciente.telefone}</Text>
          <Text style={styles.info}>🎂 Nascimento: {paciente.nascimento}</Text>
        </>
      ) : (
        <Text style={styles.info}>Nenhum paciente selecionado.</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: "center", alignItems: "center", backgroundColor: "#f9f9f9" },
  title: { fontSize: 22, fontWeight: "bold", marginBottom: 20, color: "#4390a1" },
  info: { fontSize: 16, marginBottom: 8 },
});

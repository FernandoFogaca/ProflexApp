import React, { useEffect, useState } from "react";
import { View, Text, StyleSheet, Dimensions } from "react-native";
import { PieChart } from "react-native-chart-kit";

export default function NewsChart() {
  const [dados, setDados] = useState([]);

  useEffect(() => {
    const carregarNoticias = async () => {
      try {
        const API_KEY = "SUA_API_KEY_AQUI";
        const response = await fetch(
          `https://newsapi.org/v2/top-headlines?country=br&apiKey=${API_KEY}`
        );
        const data = await response.json();

     
        const contagem = {};
        data.articles.forEach((item) => {
          const fonte = item.source.name;
          contagem[fonte] = (contagem[fonte] || 0) + 1;
        });

      
        const top = Object.entries(contagem)
          .sort((a, b) => b[1] - a[1])
          .slice(0, 5)
          .map(([fonte, valor], index) => ({
            name: fonte,
            population: valor,
            color: ["#4390a1", "#f39c12", "#e74c3c", "#2ecc71", "#9b59b6"][index],
            legendFontColor: "#333",
            legendFontSize: 12,
          }));

        setDados(top);
      } catch (error) {
        console.error("Erro ao carregar notícias:", error);
      }
    };

    carregarNoticias();
  }, []);

  return (
    <View style={styles.container}>
      <Text style={styles.titulo}>📊 Fontes mais citadas</Text>
      {dados.length > 0 ? (
        <PieChart
          data={dados}
          width={Dimensions.get("window").width - 40}
          height={220}
          chartConfig={{
            backgroundColor: "#fff",
            backgroundGradientFrom: "#fff",
            backgroundGradientTo: "#fff",
            color: (opacity = 1) => `rgba(67, 144, 161, ${opacity})`,
          }}
          accessor="population"
          backgroundColor="transparent"
          paddingLeft="15"
          absolute
        />
      ) : (
        <Text style={{ marginTop: 20 }}>Carregando gráfico...</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, padding: 20, backgroundColor: "#fff" },
  titulo: { fontSize: 18, fontWeight: "bold", marginBottom: 20, color: "#4390a1" },
});

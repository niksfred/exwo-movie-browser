import { useState } from "react";
import { Image, StyleSheet, Text, View } from "react-native";

type PosterProps = {
  url?: string;
  width: number;
};

export default function Poster({ url, width }: PosterProps) {
  return <PosterImage key={url} url={url} width={width} />;
}

function PosterImage({ url, width }: PosterProps) {
  const [failed, setFailed] = useState(false);

  return (
    <View style={[styles.frame, { width }]} accessible={false}>
      {url && !failed ? (
        <Image
          source={{ uri: url }}
          style={StyleSheet.absoluteFill}
          resizeMode="cover"
          accessible={false}
          onError={() => setFailed(true)}
        />
      ) : (
        <Text style={styles.fallback}>No poster</Text>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  frame: {
    aspectRatio: 2 / 3,
    alignItems: "center",
    justifyContent: "center",
    backgroundColor: "#252733",
    borderRadius: 8,
    overflow: "hidden",
  },
  fallback: {
    color: "#E1E3ED",
    paddingHorizontal: 4,
    textAlign: "center",
  },
});

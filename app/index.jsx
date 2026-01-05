import { useRouter } from "expo-router";
import { ScrollView, View, Image, TouchableOpacity, Text, StatusBar, StyleSheet } from "react-native";
import logo from "../assets/images/dinetimelogo.png";
import { SafeAreaView } from "react-native-safe-area-context";

export default function Index() {
  const router = useRouter();

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="light-content" backgroundColor="#2b2b2b" />
      <ScrollView contentContainerStyle={styles.scrollContent}>
        <View style={styles.content}>
          <Image source={logo} style={styles.logo} />
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              onPress={() => router.push("/login")}
              style={styles.primaryButton}
            >
              <Text style={styles.primaryButtonText}>Sign In</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/signup")}
              style={styles.secondaryButton}
            >
              <Text style={styles.secondaryButtonText}>Sign Up</Text>
            </TouchableOpacity>

            <TouchableOpacity
              onPress={() => router.push("/(tabs)/home")}
              style={styles.guestButton}
            >
              <Text style={styles.guestButtonText}>Continue as Guest</Text>
            </TouchableOpacity>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#2b2b2b',
  },
  scrollContent: {
    flexGrow: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  content: {
    width: '100%',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  logo: {
    width: 280,
    height: 280,
    marginBottom: 40,
  },
  buttonContainer: {
    width: '85%',
    maxWidth: 400,
  },
  primaryButton: {
    backgroundColor: '#f49b33',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    shadowColor: '#f49b33',
    shadowOffset: { width: 0, height: 4 },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 5,
  },
  primaryButtonText: {
    color: '#000',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  secondaryButton: {
    backgroundColor: '#3b3b3b',
    paddingVertical: 16,
    paddingHorizontal: 24,
    borderRadius: 16,
    marginBottom: 16,
    borderWidth: 2,
    borderColor: '#f49b33',
  },
  secondaryButtonText: {
    color: '#f49b33',
    fontSize: 18,
    fontWeight: 'bold',
    textAlign: 'center',
  },
  guestButton: {
    paddingVertical: 12,
    marginTop: 8,
  },
  guestButtonText: {
    color: '#9ca3af',
    fontSize: 16,
    textAlign: 'center',
  },
});
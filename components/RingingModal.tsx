import * as Haptics from "expo-haptics";
import { Modal, Pressable, StyleSheet, Text, View } from "react-native";

interface RingingModalProps {
    visible: boolean;
    onStop: () => void;
}

export default function RingingModal({ visible, onStop }: RingingModalProps) {
    return (
        <Modal visible={visible} transparent animationType="fade">
            <View style={styles.overlay}>
                <View style={styles.box}>
                    <Text style={styles.bell}>🔔</Text>

                    <Text style={styles.title}>Wake up!</Text>

                    <Text style={styles.subtitle}>
                        Your alarm is ringing!
                    </Text>

                    <Pressable style={styles.button}
                        onPress={() => {
                            Haptics.impactAsync(Haptics.ImpactFeedbackStyle.Heavy);
                            onStop();
                        }}>
                        <Text style={styles.buttonText}>Turn off</Text>
                    </Pressable>
                </View>
            </View>
        </Modal >
    );
}

const styles = StyleSheet.create({
    overlay: {
        flex: 1,
        backgroundColor: "rgba(15, 23, 42, 0.8)",
        justifyContent: "center",
        alignItems: "center",
        padding: 24,
    },
    box: {
        backgroundColor: "white",
        width: "100%",
        maxWidth: 350,
        borderRadius: 48,
        padding: 32,
        alignItems: "center",
        shadowColor: "#000",
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    bell: {
        fontSize: 64,
        marginBottom: 24,
    },
    title: {
        fontSize: 32,
        fontWeight: "900",
        textAlign: "center",
        color: "#0f172a",
        marginBottom: 8,
    },
    subtitle: {
        fontSize: 16,
        color: "#64748b",
        fontWeight: "700",
        textAlign: "center",
        marginBottom: 32,
    },
    button: {
        width: "100%",
        backgroundColor: "#ef4444",
        paddingVertical: 20,
        borderRadius: 32,
        alignItems: "center",
    },
    buttonText: {
        color: "white",
        fontWeight: "900",
        fontSize: 20,
    },
});


import { Audio } from "expo-av";
import React, { useRef, useState } from 'react';
import { Pressable, ScrollView, StyleSheet, Text, TextInput, View } from "react-native";

export interface RecordingItem {
    id: string;
    name: string;
    uri: string;
}

interface ControlsProps {
    recordings: RecordingItem[];
    setRecordings: React.Dispatch<React.SetStateAction<RecordingItem[]>>;
    selectedUrl: string | null;
    setSelectedUrl: (url: string | null) => void;
    alarmTime: string;
    setAlarmTime: (time: string) => void;
    onSetAlarm: () => void;
    isAlarmSet: boolean;
    onClearAlarm: () => void;
}

export default function Controls({
    recordings,
    setRecordings,
    selectedUrl,
    setSelectedUrl,
    alarmTime,
    setAlarmTime,
    onSetAlarm,
    isAlarmSet,
    onClearAlarm

}: ControlsProps) {
    const [isRecording, setIsRecording] = useState(false);
    const mediaRecorder = useRef<Audio.Recording | null>(null);
    const recordingRef = useRef<Audio.Recording | null>(null);
    const sound = useRef<Audio.Sound | null>(null);

    //recording
    const startRecording = async () => {
        try {
            await Audio.requestPermissionsAsync();

            const recording = new Audio.Recording();
            await recording.prepareToRecordAsync(
                Audio.RecordingOptionsPresets.HIGH_QUALITY
            );
            await recording.startAsync();

            recordingRef.current = recording;
            setIsRecording(true);
        }
        catch (err) {
            console.log("Recording error:", err);
        }
    };

    //stop recording
    const stopRecording = async () => {
        try {
            if (!recordingRef.current) return;

            //stop recording
            await recordingRef.current.stopAndUnloadAsync();
            const uri = recordingRef.current.getURI();

            if (uri) {
                const newRec: RecordingItem = {
                    id: Date.now().toString(),
                    name: `Recording ${recordings.length + 1}`,
                    uri,
                };

                setRecordings((prev) => [newRec, ...prev]);
                setSelectedUrl(uri);

            }

            setIsRecording(false);
            recordingRef.current = null;

        } catch (err) {
            console.log("Stop error:", err);
        }
    };

    //play the recording

    const playRecording = async (uri: string) => {
        try {
            if (sound.current) {
                await sound.current.unloadAsync();
                sound.current = null;
            }

            const { sound: newSound } = await Audio.Sound.createAsync({ uri });
            sound.current = newSound;
            await newSound.playAsync();
        } catch (err) {
            console.log("Playback error:", err);
        }
    };

    return (
        <View style={styles.container}>
            {/* Record alarm */}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Record the alarm</Text>
                <Pressable
                    onPress={isRecording ? stopRecording : startRecording}

                    style={[
                        styles.recordButton,
                        isRecording ? styles.recording : styles.idle,
                    ]} >

                    <Text style={styles.recordButtonText}>
                        {isRecording ? "Stop recording" : "Start recording"}
                    </Text>
                </Pressable>
            </View>

            {/* Choose alarm */}

            <View style={styles.section}>
                <Text style={styles.sectionTitle}>Choose the alarm</Text>
                <ScrollView style={styles.list}> {recordings.map((rec) =>
                (<Pressable key={rec.id} onPress={() => {
                    setSelectedUrl(rec.uri);
                    playRecording(rec.uri);
                }}
                    style={[styles.listItem, selectedUrl === rec.uri ? styles.listItemSelected : styles.listItemIdle,]} >
                    <Text style={[styles.listItemText, selectedUrl === rec.uri && styles.listItemTextSelected,]}>
                        {rec.name}
                    </Text>
                    {selectedUrl === rec.uri && <Text style={styles.check}>▶
                    </Text>}
                </Pressable>))}
                    {recordings.length === 0 && (<Text style={styles.empty}>No alarms.</Text>)}
                </ScrollView>
            </View>

            {/* Set the alarm */}

            <View style={styles.section}> <Text style={styles.sectionTitle}>Set the alarm</Text> <TextInput style={styles.timeInput} placeholder="HH:MM" value={alarmTime} onChangeText={setAlarmTime} /> <Pressable onPress={isAlarmSet ? onClearAlarm : onSetAlarm} style={[styles.setButton, isAlarmSet ? styles.delete : styles.set]} > <Text style={styles.setButtonText}> {isAlarmSet ? "Delete" : "Set"} </Text> </Pressable> </View> </View >);
}

// Styles
const styles = StyleSheet.create({
    container: {
        width: "80%",
        gap: 4,
    },

    section: {
        backgroundColor: "rgba(255,255,255,0.9)",
        padding: 15,
        borderRadius: 24,
        borderWidth: 2,
        borderColor: "white",
        shadowColor: "#000",
        shadowOpacity: 0.1,
        shadowRadius: 10,
    },

    sectionTitle: {
        fontSize: 10,
        fontWeight: "900",
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: 2,
        marginBottom: 7,
    },

    // RECORD BUTTON
    recordButton: {
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: "center",
    },

    recordButtonText: {
        fontSize: 16,
        fontWeight: "900",
        color: "white",
    },

    idle: {
        backgroundColor: "#7c3aed",
    },

    recording: {
        backgroundColor: "#ef4444",
    },

    //List

    list: {
        maxHeight: 160,
    },

    listItem: {
        padding: 16,
        borderRadius: 16,
        marginBottom: 8,
        flexDirection: "row",
        justifyContent: "space-between",
    },

    listItemIdle: {
        backgroundColor: "#f1f5f9",
    },

    listItemSelected: {
        backgroundColor: "#7c3aed",
    },

    listItemText: {
        fontWeight: "700",
        color: "#334155",
    },

    listItemTextSelected: {
        color: "white",
    },

    check: {
        color: "white",
        fontWeight: "900",
    },

    empty: {
        textAlign: "center",
        paddingVertical: 16,
        fontSize: 12,
        fontWeight: "700",
        color: "#94a3b8",
        fontStyle: "italic",
    },

    // TIME INPUT
    timeInput: {
        backgroundColor: "#f1f5f9",
        padding: 12,
        borderRadius: 12,
        fontSize: 18,
        fontWeight: "700",
        marginBottom: 10,
    },

    // SET BUTTON
    setButton: {
        paddingVertical: 16,
        borderRadius: 20,
        alignItems: "center",
    },

    setButtonText: {
        fontSize: 16,
        fontWeight: "900",
        color: "white",
    },

    set: {
        backgroundColor: "#fbbf24",
    },

    delete: {
        backgroundColor: "#f97316",
    },
});
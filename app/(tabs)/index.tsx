import Clock from "@/components/Clock";
import Controls, { RecordingItem } from "@/components/Controls";
import RingingModal from "@/components/RingingModal";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { Audio } from "expo-av";
import { useEffect, useRef, useState } from "react";
import { ImageBackground, KeyboardAvoidingView, Platform, StyleSheet, Text, View } from "react-native";


export default function HomeScreen() {
  const [ringing, setRinging] = useState(false);
  const [recordings, setRecordings] = useState<RecordingItem[]>([]);
  const [selectedUrl, setSelectedUrl] = useState<string | null>(null);
  const [alarmTime, setAlarmTime] = useState("");
  const [isAlarmSet, setIsAlarmSet] = useState(false);
  const alarmSound = useRef<Audio.Sound | null>(null);

  //save recordings
  useEffect(() => {
    AsyncStorage.setItem("recordings", JSON.stringify(recordings));
  }, [recordings]);

  //normalize time so that it is possible to set the alarm in a couple of ways
  const normalizeTime = (time: string) => {
    const [h, m] = time.split(":");
    const hh = h.padStart(2, "0");
    const mm = m.padStart(2, "0");
    return `${hh}:${mm}`;
  };

  //setting the alarm 
  useEffect(() => {
    if (!isAlarmSet || !alarmTime) return;

    const interval = setInterval(() => {
      const now = new Date();
      const current = now.toLocaleTimeString([], {
        hour: "2-digit",
        minute: "2-digit",
        hour12: false,
      });

      if (current === normalizeTime(alarmTime)) {
        setRinging(true);
      }
    }, 1000);

    return () => clearInterval(interval);
  }, [isAlarmSet, alarmTime]);


  useEffect(() => {
    const playAlarm = async () => {
      if (!selectedUrl) return;

      try {
        // stop alarm
        if (alarmSound.current) {
          await alarmSound.current.stopAsync();
          await alarmSound.current.unloadAsync();
          alarmSound.current = null;
        }

        // new sound
        const { sound } = await Audio.Sound.createAsync({ uri: selectedUrl });
        alarmSound.current = sound;
        await sound.playAsync();
      } catch (err) {
        console.log("Alarm playback error:", err);
      }
    };

    if (ringing) {
      playAlarm();
    } else {
      // when ringing is false, stop alarm
      if (alarmSound.current) {
        alarmSound.current.stopAsync();
        alarmSound.current.unloadAsync();
        alarmSound.current = null;
      }
    }
  }, [ringing]);


  return (
    <KeyboardAvoidingView style={{ flex: 1 }} behavior={Platform.OS === "ios" ? "padding" : "height"} >
      <ImageBackground source={require("../../assets/images/backgroungpic.png")} style={styles.background}>
        <View style={styles.container}>
          <Text style={styles.title}>ALARMY CLOCKY</Text>
          <Clock />
          <Text style={styles.subtitle}>Record your own alarm :=)</Text>

          <Controls recordings={recordings}
            setRecordings={setRecordings}
            selectedUrl={selectedUrl}
            setSelectedUrl={setSelectedUrl}
            alarmTime={alarmTime}
            setAlarmTime={setAlarmTime}
            onSetAlarm={() => setIsAlarmSet(true)}
            isAlarmSet={isAlarmSet}
            onClearAlarm={() => setIsAlarmSet(false)} />
        </View>
        <RingingModal visible={ringing} onStop={() => setRinging(false)} />
      </ImageBackground>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  background: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  container: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    padding: 20,
    paddingTop: 128,
  },
  title: {
    fontSize: 40,
    fontWeight: "900",
    color: "#333",
  },
  subtitle: {
    fontSize: 20,
    color: "#333",
    marginTop: 6,
    marginBottom: 10,
    fontWeight: "900",
  },

});

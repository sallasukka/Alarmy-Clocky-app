
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from "react-native";

export default function Clock() {
    const [time, setTime] = useState(new Date());

    useEffect(() => {
        const timer = setInterval(() => setTime(new Date()), 1000);
        return () => clearInterval(timer);
    }, []);

    return (
        <View style={styles.box}>
            <Text style={styles.time}>
                {time.toLocaleTimeString([],
                    {
                        hour: '2-digit',
                        minute: '2-digit',
                        second: '2-digit',
                        hour12: false
                    })}
            </Text>
            <Text style={styles.date}>
                {time.toLocaleDateString('fi-FI',
                    {
                        weekday: 'short',
                        day: 'numeric',
                        month: 'long'
                    })}
            </Text>
        </View>
    );
}

const styles = StyleSheet.create({
    box: {
        backgroundColor: "rgba(255,255,255,0.4)",
        padding: 20,
        borderRadius: 24,
        width: "80%",
        alignItems: "center",
        borderWidth: 2,
        borderColor: "rgba(255,255,255,0.5)",
    },
    time: {
        fontSize: 48,
        fontWeight: "900",
        color: "#1e293b",
    },
    date: {
        marginTop: 8,
        fontSize: 14,
        fontWeight: "800",
        color: "#475569",
        textTransform: "uppercase",
        letterSpacing: 2,
    }
})

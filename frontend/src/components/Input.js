import React from 'react';
import { StyleSheet, View } from 'react-native';
import { TextInput } from 'react-native-paper';

const Input = ({ label, value, onChangeText, secureTextEntry, ...props }) => {
    return (
        <View style={styles.container}>
            <TextInput
                label={label}
                value={value}
                onChangeText={onChangeText}
                secureTextEntry={secureTextEntry}
                mode="outlined"
                style={styles.input}
                theme={{ colors: { primary: '#2E7D32' } }} // Sample green theme
                {...props}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        marginBottom: 15,
        width: '100%',
    },
    input: {
        backgroundColor: '#fff',
    },
});

export default Input;

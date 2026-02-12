import React from 'react';
import { StyleSheet } from 'react-native';
import { Button as PaperButton } from 'react-native-paper';

const Button = ({ mode, style, children, ...props }) => {
    return (
        <PaperButton
            mode={mode || 'contained'}
            style={[styles.button, style]}
            labelStyle={styles.text}
            buttonColor={mode === 'outlined' ? '#fff' : '#2E7D32'}
            textColor={mode === 'outlined' ? '#2E7D32' : '#fff'}
            {...props}
        >
            {children}
        </PaperButton>
    );
};

const styles = StyleSheet.create({
    button: {
        marginVertical: 10,
        paddingVertical: 5,
        borderRadius: 5,
        borderColor: '#2E7D32',
    },
    text: {
        fontWeight: 'bold',
        fontSize: 15,
    },
});

export default Button;

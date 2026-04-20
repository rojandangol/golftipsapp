import React, { ReactNode } from 'react';
import { View, StyleSheet } from 'react-native';
import { List } from 'react-native-paper';
import { useTheme } from '@/components/ThemeContext';

interface AccordionSectionProps {
  title: string;
  children: ReactNode;
  backgroundColor?: string;
  textColor?: string;
}

const Accordion = ({ title, children, backgroundColor, textColor }: AccordionSectionProps) => {
  const { theme } = useTheme();

  return (
    <View style={styles.wrapper}>
      <List.Section style={{ padding: 0, margin: 0 }}>
        <List.Accordion
          title={title}
          titleStyle={{
            fontWeight: 'bold',
            color: textColor ?? theme.aboutText,
          }}
          style={[
            styles.accordion,
            { backgroundColor: backgroundColor ?? theme.accordion },
          ]}
          theme={{ colors: { primary: textColor ?? theme.signupText } }}
        >
          <View style={[styles.contentContainer, { backgroundColor: theme.container }]}>
            {children}
          </View>
        </List.Accordion>
      </List.Section>
    </View>
  );
};

export default Accordion;

const styles = StyleSheet.create({
  wrapper: {
    marginBottom: 12,
  },
  accordion: {
    borderRadius: 10,
    overflow: 'hidden',
  },
  contentContainer: {
    padding: 10,
  },
});

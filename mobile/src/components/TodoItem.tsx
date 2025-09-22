import React from 'react';
import { View, Text, StyleSheet, Pressable } from 'react-native';
import { Swipeable } from 'react-native-gesture-handler';
import type { Todo } from '../types';

interface Props {
  item: Todo;
  onToggle: (id: string, completed: boolean) => void;
  onDelete: (id: string) => void;
}

export const TodoItem: React.FC<Props> = ({ item, onToggle, onDelete }) => {
  const renderRight = () => (
    <Pressable style={styles.swipeDelete} onPress={() => onDelete(item._id)}>
      <Text style={styles.swipeDeleteText}>Delete</Text>
    </Pressable>
  );
  return (
    <Swipeable renderRightActions={renderRight} overshootRight={false}>
      <View style={[styles.container, item.completed && styles.containerCompleted]}>
        <Pressable
          accessibilityRole="checkbox"
          accessibilityState={{ checked: item.completed }}
          onPress={() => onToggle(item._id, item.completed)}
          style={[styles.checkbox, item.completed && styles.checkboxChecked]}
        >
          {item.completed && <Text style={styles.checkmark}>✓</Text>}
        </Pressable>
        <Text style={[styles.text, item.completed && styles.textCompleted]}>{item.text}</Text>
        <Pressable
          accessibilityLabel={`Delete task: ${item.text}`}
          onPress={() => onDelete(item._id)}
          style={styles.deleteBtn}
        >
          <Text style={styles.deleteText}>🗑️</Text>
        </Pressable>
      </View>
    </Swipeable>
  );
};

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    paddingVertical: 18,
    paddingHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#e5e7eb',
    shadowColor: '#000',
    shadowOpacity: 0.08,
    shadowRadius: 8,
    shadowOffset: { width: 0, height: 4 },
    elevation: 2,
  },
  containerCompleted: {
    backgroundColor: '#f0fdf4',
    borderColor: '#10b981',
  },
  checkbox: {
    width: 24,
    height: 24,
    borderRadius: 8,
    borderWidth: 2,
    borderColor: '#d1d5db',
    alignItems: 'center',
    justifyContent: 'center',
  },
  checkboxChecked: {
    backgroundColor: '#10b981',
    borderColor: '#10b981',
  },
  checkmark: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 14,
  },
  text: {
    flex: 1,
    fontSize: 16,
    color: '#374151',
  },
  textCompleted: {
    textDecorationLine: 'line-through',
    opacity: 0.6,
  },
  deleteBtn: {
    padding: 8,
    backgroundColor: '#fee2e2',
    borderRadius: 10,
  },
  deleteText: {
    fontSize: 16,
  },
  swipeDelete: {
    backgroundColor: '#dc2626',
    justifyContent: 'center',
    alignItems: 'flex-end',
    paddingHorizontal: 24,
    marginVertical: 4,
    borderRadius: 16,
  },
  swipeDeleteText: {
    color: 'white',
    fontWeight: '600',
  },
});
